import { eq, inArray, or, and, sql, isNotNull, notInArray } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Insurance } from "../../../../domain/entities/EntityInsurance/Insurance";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { insuranceTable, insuranceToModalitiesTable, insuranceToSpecialtyTable } from "../../Schema/InsuranceSchema";
import { IRepository } from "../IRepository";
import { specialtyTable } from "../../Schema/SpecialtySchema";
import { modalityTable } from "../../Schema/ModalitiesSchema";

export class InsuranceRepository implements IRepository {
    async create(insurance: Insurance, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db

        const specialties = insurance.specialties!.filter((sp) => sp.getUUIDHash() !== "")
        const insuranceInserted = await dbUse.insert(insuranceTable)
            .values({
                id: insurance.getUUIDHash(),
                name: insurance.name ?? "",
            }).returning()

        const insurancePerSpecialty = await dbUse.insert(insuranceToSpecialtyTable)
            .values(specialties.map((sp) => {
                return {
                    amountTransferred: sp.amountTransferred,
                    price: sp.price,
                    insurance_id: insurance.getUUIDHash(), // assuming Insurance has an id property
                    specialty_id: sp.getUUIDHash(), // replace with actual property for specialty id
                }
            })).returning()

        const insurancePerModality = await dbUse.insert(insuranceToModalitiesTable).values(insurance.modalities?.map((md) => {
            return {
                insurance_id: insurance.getUUIDHash(),
                modality_id: md.getUUIDHash()
            }
        }) ?? []).returning()

        return [...insuranceInserted, ...insurancePerModality, ...insurancePerSpecialty]

    }
    async findEntity(insurance: Insurance) {
        return db.transaction(async (tx) => {
            const specialtyFilter =
                insurance.specialties?.length
                    ? inArray(
                        specialtyTable.id,
                        insurance.specialties
                            .map((sp) => sp.getUUIDHash())
                            .filter((sp) => sp !== "")
                    )
                    : undefined;
            const whereCondition = specialtyFilter
                ? and(
                    or(
                        eq(insuranceTable.name, insurance.name ?? ""),
                        eq(insuranceTable.id, insurance.getUUIDHash() ?? undefined)
                    ),
                    specialtyFilter
                )
                : or(
                    eq(insuranceTable.name, insurance.name ?? ""),
                    eq(insuranceTable.id, insurance.getUUIDHash() ?? undefined)
                );
            return tx.select({
                id: insuranceTable.id,
                type: insuranceTable.name,
                specialties: sql`
                json_agg(
                    json_build_object(
                        'id', ${specialtyTable.id},
                        'name', ${specialtyTable.name}
                        )
                )`,
                modalities: sql`
                    (
                        SELECT json_agg(
                        json_build_object(
                            'id', m.mod_id,
                            'name', m.mod_name
                        )
                        )
                        FROM ${insuranceToModalitiesTable} itm
                        INNER JOIN modality m ON m.mod_id = itm.fk_inm_mod_id
                        WHERE itm.fk_inm_ins_id = ${insuranceTable.id}
                    )
                    `.as("modalities")
            })
                .from(insuranceTable)
                .leftJoin(
                    insuranceToSpecialtyTable,
                    eq(insuranceToSpecialtyTable.insurance_id, insuranceTable.id)
                )
                .leftJoin(
                    specialtyTable,
                    eq(specialtyTable.id, insuranceToSpecialtyTable.specialty_id)
                )
                .where(whereCondition)
                .groupBy(insuranceTable.id, insuranceTable.name);

        });
    }


    async updateEntity(insurance: Insurance, tx?: any): Promise<any> {

        const dbUse = tx ? tx : db
        const insuranceUpdated = await dbUse.update(insuranceTable).set({
            name: insurance.name,
            updatedAt: insurance.getUpdatedAt()
        }).where(
            eq(insuranceTable.id, insurance.getUUIDHash())
        ).returning()
        
        return insuranceUpdated
    }

    async modalitiesInsuranceSync(insurance: Insurance, tx?: any) {
        const dbUse = tx ? tx : db
        const modalitiesUpdated = await Promise.all(insurance.modalities?.map(async (mod) => {
            return await dbUse.update(modalityTable)
                .set({
                    name: mod?.name,
                    updatedAt: mod?.getUpdatedAt()
                })
                .where(
                    eq(modalityTable.id, mod.getUUIDHash())).returning();
        }) ?? [])
        const insurancePerModality = await db.insert(insuranceToModalitiesTable).values(insurance.modalities?.map((md) => {
            return {
                insurance_id: insurance.getUUIDHash(),
                modality_id: md.getUUIDHash()
            }
        }) ?? []).returning()

        return [...insurancePerModality, ...modalitiesUpdated]
    }

    async addSpecialty(insurance: Insurance, tx?: any) {
        const dbUse = tx ? tx : db
        const specialtyUpdated = await Promise.all(insurance.specialties?.map(async (sp) => {
            return await dbUse.update(insuranceToSpecialtyTable)
                .set({
                    amountTransferred: sp.amountTransferred,
                    price: sp.price
                })
                .where(
                    and(
                        eq(insuranceToSpecialtyTable.insurance_id, insurance.getUUIDHash()),
                        eq(insuranceToSpecialtyTable.specialty_id, sp.getUUIDHash())
                    )
                ).returning();

        }) ?? [])

        return specialtyUpdated
    }

    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(insurance: Insurance | Array<Insurance>, limit: number, offset: number): Promise<any> {
        try {
            const insurancesFormatted = Array.isArray(insurance) ? insurance : [insurance]
            const filters = []
            if (insurancesFormatted && insurancesFormatted.length && insurancesFormatted[0]) {
                filters.push(inArray(insuranceTable.name, insurancesFormatted.map((ins) => ins?.name ?? "")))
                filters.push(inArray(insuranceTable.id, insurancesFormatted.map((ins) => ins?.getUUIDHash() ?? undefined)))
            } else {
                filters.push(isNotNull(insuranceTable.id))
            }
            const insurances = await db
                .select({
                    id: insuranceTable.id,
                    type: insuranceTable.name,
                    specialties: sql`
                    (
                        SELECT json_agg(
                        json_build_object(
                            'id', s.spe_id,
                            'name', s.spe_name
                        )
                        )
                        FROM ${insuranceToSpecialtyTable} its
                        INNER JOIN specialty s ON s.spe_id = its.fk_isp_spe_id
                        WHERE its.fk_isp_ins_id = ${insuranceTable.id}
                    )
                    `.as("specialties"),
                    modalities: sql`
                    (
                        SELECT json_agg(
                        json_build_object(
                            'id', m.mod_id,
                            'name', m.mod_name
                        )
                        )
                        FROM ${insuranceToModalitiesTable} itm
                        INNER JOIN modality m ON m.mod_id = itm.fk_inm_mod_id
                        WHERE itm.fk_inm_ins_id = ${insuranceTable.id}
                    )
                    `.as("modalities")
                })
                .from(insuranceTable)
                .where(or(...filters))
                .limit(limit)
                .offset(offset);

            return insurances
        } catch (e) {
            console.log(e)
            return ResponseHandler.error("Failed to find the insurances")
        }
    }

}
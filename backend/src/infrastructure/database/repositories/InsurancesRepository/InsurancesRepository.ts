import { eq, inArray, or, and, sql, isNotNull } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Insurance } from "../../../../domain/entities/EntityInsurance/Insurance";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { insuranceTable, insuranceToModalitiesTable, insuranceToSpecialtyTable } from "../../Schema/InsuranceSchema";
import { IRepository } from "../IRepository";
import { specialtyTable } from "../../Schema/SpecialtySchema";

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
                        eq(insuranceTable.id, insurance.getUUIDHash() ?? "")
                    ),
                    specialtyFilter
                )
                : or(
                    eq(insuranceTable.name, insurance.name ?? ""),
                    eq(insuranceTable.id, insurance.getUUIDHash() ?? "")
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



    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(insurance: Insurance | Array<Insurance>, limit: number, offset: number): Promise<any> {
        try {
            const insurancesFormatted = Array.isArray(insurance) ? insurance : [insurance]
            const filters = []
            if (insurancesFormatted && insurancesFormatted.length && insurancesFormatted[0]) {
                console.log(insurancesFormatted)
                filters.push(inArray(insuranceTable.name, insurancesFormatted.map((ins) => ins?.name ?? "")))
                filters.push(inArray(insuranceTable.id, insurancesFormatted.map((ins) => ins?.getUUIDHash() ?? "")))
            } else {
                filters.push( isNotNull(insuranceTable.id))
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
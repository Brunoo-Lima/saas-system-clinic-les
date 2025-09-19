import { eq, inArray, or, and } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Insurance } from "../../../../domain/entities/EntityInsurance/Insurance";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { insuranceTable, insuranceToSpecialtyTable  } from "../../Schema/InsuranceSchema";
import { IRepository } from "../IRepository";
import { specialtyTable } from "../../Schema/SpecialtySchema";

export class InsuranceRepository implements IRepository {
    async create(insurance: Insurance): Promise<any> {
        try {
            return await db.transaction(async (tx) => {
                const specialties = insurance.specialties!.filter((sp) => sp.getUUIDHash() !== "")
                const insuranceInserted = await tx.insert(insuranceTable)
                    .values({
                        id: insurance.getUUIDHash(),
                        name: insurance.name ?? "",
                    }).returning({
                        id: insuranceTable.id
                    })

                const insurancePerSpecialty = await tx.insert(insuranceToSpecialtyTable)
                    .values(specialties.map((sp) => {
                        return {
                            amountTransferred: sp.amountTransferred,
                            price: sp.price,
                            insurance_id: insuranceInserted[0]?.id, // assuming Insurance has an id property
                            specialty_id: sp.getUUIDHash(), // replace with actual property for specialty id
                        }
                    })).returning()

                return insurancePerSpecialty
            })
        } catch (e) {
            return ResponseHandler.error("Failed to create a new Insurance")
        }
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
                        eq(insuranceTable.id, insurance.getUUIDHash())
                    ),
                    specialtyFilter
                )
                : or(
                    eq(insuranceTable.name, insurance.name ?? ""),
                    eq(insuranceTable.id, insurance.getUUIDHash())
                );

            return tx
                .select({
                    id: insuranceTable.id,
                    type: insuranceTable.name,
                    specialtyName: specialtyTable.name,
                    specialtyId: specialtyTable.id,
                })
                .from(insuranceTable)
                .where(whereCondition)
                .leftJoin(
                    insuranceToSpecialtyTable,
                    eq(insuranceToSpecialtyTable.insurance_id, insuranceTable.id)
                )
                .leftJoin(
                    specialtyTable,
                    eq(specialtyTable.id, insuranceToSpecialtyTable.specialty_id)
                );
        });
    }



    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(insurance?: Insurance | Array<Insurance>): Promise<any> {
        try{ 
            const insurancesFormatted = Array.isArray(insurance) ? insurance : [insurance]
            const insurances = await db.select().from(insuranceTable)
            .where(
                or(
                    inArray(insuranceTable.name, insurancesFormatted.map((ins) => ins?.name ?? "")),
                    inArray(insuranceTable.id, insurancesFormatted.map((ins) => ins?.getUUIDHash() ?? ""))
                )
            )
            return insurances
        } catch (e) {
            return ResponseHandler.error("Failed to find the insurances")
        }
    }

}
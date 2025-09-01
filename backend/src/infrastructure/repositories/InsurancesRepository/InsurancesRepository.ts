import { eq, ilike, inArray, or, and } from "drizzle-orm";
import { EntityDomain } from "../../../domain/entities/EntityDomain";
import { Insurance } from "../../../domain/entities/EntityInsurance/Insurance";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import db from "../../database/connection";
import { insuranceTable, insuranceToSpecialtyTable, specialtyTable } from "../../database/schema";
import { IRepository } from "../IRepository";

export class InsuranceRepository implements IRepository {
    async create(insurance: Insurance): Promise<any> {
        try {
            return await db.transaction(async (tx) => {
                const idsSpecialties = insurance.specialties!.map((sp) => sp.getUUIDHash())
                const insuranceInserted = await tx.insert(insuranceTable)
                    .values({
                        id: insurance.getUUIDHash(),
                        type: insurance.type ?? ""
                    }).returning({
                        id: insuranceTable.id
                    })

                const insurancePerSpecialty = await tx.insert(insuranceToSpecialtyTable)
                    .values(idsSpecialties.map((id) => {
                        return {
                            insurance_id: insuranceInserted[0]?.id, // assuming Insurance has an id property
                            specialty_id: id, // replace with actual property for specialty id
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
            let query = tx
                .select({
                    id: insuranceTable.id,
                    type: insuranceTable.type,
                    specialtyName: specialtyTable.name,
                    specialtyId: specialtyTable.id
                })
                .from(insuranceTable)
                .where(
                    or(
                        eq(insuranceTable.type, insurance.type ?? ""),
                        eq(insuranceTable.id, insurance.getUUIDHash())
                    )
                ).leftJoin(
                    insuranceToSpecialtyTable,
                    or(
                        eq(insuranceToSpecialtyTable.insurance_id, insuranceTable.id),
                        inArray(
                            insuranceToSpecialtyTable.specialty_id,
                            (insurance.specialties?.map((sp) => sp.getUUIDHash()).filter(sp => sp !== "")) ?? []
                        )
                    ),
                    
                ).leftJoin(
                    specialtyTable,
                    inArray(specialtyTable.id, (insurance.specialties?.map((sp) => sp.getUUIDHash()).filter(sp => sp !== "")) ?? [])
                )

            return query;
        });
    }


    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
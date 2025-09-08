import { eq, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Patient } from "../../../../domain/entities/EntityPatient/Patient";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { addressTable, patientTable, patientToInsuranceTable, userTable } from "../../schema";
import { IRepository } from "../IRepository";

export class PatientRepository implements IRepository {
    async create(patient: Patient): Promise<any> {
        try {
            const userID = patient.user?.getUUIDHash()
            const patientInserted = await db.insert(patientTable).values(
                {
                    id: patient.getUUIDHash(),
                    contact1: patient.contact ?? "",
                    cpf: patient.cpf ?? "",
                    name: patient.name ?? "",
                    dateOfBirth: patient.dateOfBirth?.toDateString() ?? "",
                    user_id: userID && userID !== "" ? userID : null // UUID ou nulo, essa é a tipagem default do drizzle
                }
            ).returning()
            return patientInserted;
        } catch (e) {
            console.log(e)
            return ResponseHandler.error("Failed to create a new patient")
        }
    }
    async findEntity(patient: Patient): Promise<any> {
        try {
            const result = await db.transaction(async (tx) => {
                const patientFounded = await tx.select().from(patientTable)
                    .where(
                        or(
                            eq(patientTable.id, patient.getUUIDHash()),
                            eq(patientTable.name, patient.name ?? ""),
                            eq(patientTable.cpf, patient.cpf ?? ""),
                        )
                    ).leftJoin(patientToInsuranceTable,
                        eq(patientToInsuranceTable.patient_id, patient.getUUIDHash())
                    ).leftJoin(addressTable,
                        eq(addressTable.id, patientTable.address_id)
                    ).leftJoin(userTable,
                        eq(userTable.id, patientTable.user_id)
                    )

                return patientFounded
            })
            return result
        } catch (e) {
            return ResponseHandler.error("Failed to find the patient.")
        }
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
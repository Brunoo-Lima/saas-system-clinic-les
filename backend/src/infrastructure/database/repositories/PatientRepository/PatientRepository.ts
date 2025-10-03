import { and, eq, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Patient } from "../../../../domain/entities/EntityPatient/Patient";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { addressTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";
import { patientTable } from "../../Schema/PatientSchema";
import { userTable } from "../../Schema/UserSchema";
import { cardInsuranceTable } from "../../Schema/CardInsuranceSchema";

export class PatientRepository implements IRepository {
    async create(patient: Patient, tx: any): Promise<any> {

        const userID = patient.user?.getUUIDHash()
        const dbUse = tx ? tx : db
        const patientInserted = await dbUse.insert(patientTable).values(
            {
                id: patient.getUUIDHash(),
                cpf: patient.cpf ?? "",
                sex: patient.sex ?? "",
                name: patient.name ?? "",
                phone: patient.phone ?? "",
                dateOfBirth: patient.dateOfBirth?.toDateString() ?? "",
                user_id: userID && userID !== "" ? userID : null, // UUID ou nulo, essa é a tipagem default do drizzle
                address_id: patient.address?.getUUIDHash() ?? null
            }
        ).returning()

        return patientInserted;

    }
    async findEntity(patient: Patient): Promise<any> {
        try {
            const result = await db.transaction(async (tx) => {
                const patientFounded = await tx.select().from(patientTable)
                    .where(
                        or(
                            eq(patientTable.id, patient.getUUIDHash()),
                            and(
                                eq(patientTable.name, patient.name ?? ""),
                                eq(patientTable.cpf, patient.cpf ?? ""),
                            ),
                            eq(userTable.id, patient.user?.getUUIDHash() ?? "")
                        )
                    )
                    .leftJoin(addressTable,
                        eq(addressTable.id, patientTable.address_id)
                    ).leftJoin(userTable,
                        eq(userTable.id, patientTable.user_id)
                    ).leftJoin(cardInsuranceTable, 
                        eq(cardInsuranceTable.patient_id, patientTable.id)
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
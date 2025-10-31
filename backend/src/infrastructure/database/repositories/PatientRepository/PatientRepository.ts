import { and, eq, or, SQL, sql } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Patient } from "../../../../domain/entities/EntityPatient/Patient";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { addressTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";
import { patientTable } from "../../Schema/PatientSchema";
import { userTable } from "../../Schema/UserSchema";
import { cardInsuranceTable } from "../../Schema/CardInsuranceSchema";
import { insuranceTable } from "../../Schema/InsuranceSchema";

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
                dateOfBirth: patient.dateOfBirth?.toISOString() ?? "",
                user_id: userID && userID !== "" ? userID : null, // UUID ou nulo, essa é a tipagem default do drizzle
                address_id: patient.address?.getUUIDHash() ?? null
            }
        ).returning()

        return patientInserted;

    }
    async findEntity(patient: Patient): Promise<any> {
        try {
            const filters: (SQL<unknown> | undefined)[] = []
            if(patient.getUUIDHash()) filters.push(eq(patientTable.id, patient.getUUIDHash()))
            if(patient.name && patient.cpf) filters.push(and(
                eq(patientTable.name, patient.name ?? ""),
                eq(patientTable.cpf, patient.cpf ?? ""),
            ),)
            if(patient.user?.getUUIDHash()) filters.push(eq(userTable.id, patient.user?.getUUIDHash()))

            const result = await db.transaction(async (tx) => {
                const patientFounded = await tx.select().from(patientTable)
                    .where(
                        or(...filters)
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
    async updateEntity(patient: Patient, tx?: any) {
        const dbUse = tx ? tx : db
        const patientUpdated = await dbUse
            .update(patientTable)
            .set({
                cpf: patient.cpf,
                dateOfBirth: patient.dateOfBirth?.toDateString() ?? undefined,
                phone: patient.phone,
                name: patient.name,
                sex: patient.sex,
                updatedAt: patient.getUpdatedAt()
            }).where(
                or(
                    eq(patientTable.id, patient.getUUIDHash() ?? "")
                )
            ).returning()
        return patientUpdated
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(patient: Patient, limit: number, offset: number) {
        try {
            const filters = []
            if(patient){
                filters.push(eq(patientTable.id, patient.getUUIDHash()))
                filters.push(eq(patientTable.cpf, patient.cpf ?? ""))
            }

            const patientsFounded = await db
            .select({
                id: patientTable.id,
                name: patientTable.name,
                cpf: patientTable.cpf,
                dateOfBirth: patientTable.dateOfBirth,
                sex: patientTable.sex,
                phone: patientTable.phone,
                address: sql`
                (
                    SELECT json_build_object(
                        'id', ${addressTable.id},
                        'name', ${addressTable.name},
                        'street', ${addressTable.street},
                        'cep', ${addressTable.cep},
                        'number', ${addressTable.number},
                        'neighborhood', ${addressTable.neighborhood},
                        'city', ${addressTable.city},
                        'state', ${addressTable.state},
                        'country', ${addressTable.state},
                        'uf', ${addressTable.uf}
                    )
                    FROM ${addressTable}
                    WHERE ${addressTable.id} = ${patientTable.address_id}
                )
                `.as("address"),
                user: sql`
                    (SELECT 
                        json_build_object(
                            'id', ${userTable.id},
                            'email', ${userTable.email},
                            'status', ${userTable.status},
                            'password', ${userTable.password}, 
                            'profileCompleted', ${userTable.profileCompleted},
                            'emailVerified', ${userTable.emailVerified},
                            'username', ${userTable.username}
                        )
                    FROM ${userTable}
                    WHERE ${userTable.id} = ${patientTable.user_id})
                `,
                cardInsurances: sql`(
                    SELECT 
                        json_agg(
                            json_build_object(
                                'id', ${cardInsuranceTable.id},
                                'cardNumber', ${cardInsuranceTable.cardNumber},
                                'validate', ${cardInsuranceTable.validate},
                                'insurance', json_build_object(
                                    'id', ${insuranceTable.id},
                                    'name', ${insuranceTable.name}
                                )
                            )
                        )
                    FROM ${cardInsuranceTable} 
                    INNER JOIN ${insuranceTable} ON ${insuranceTable.id} = ${cardInsuranceTable.insurance_id}
                    WHERE ${insuranceTable.id} = ${cardInsuranceTable.insurance_id}
                    AND ${patientTable.id} = ${cardInsuranceTable.patient_id}

                )`.as('cardInsurances')
            })
            .from(patientTable)
            .where(
                or(...filters)
            ).limit(limit).offset(offset)
            return patientsFounded
        } catch(e){
            return ResponseHandler.error("Failed to find all patients")
        }
    }

}
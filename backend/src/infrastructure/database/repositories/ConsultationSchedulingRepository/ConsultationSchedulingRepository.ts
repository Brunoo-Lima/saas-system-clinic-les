import { and, eq, or, sql } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Scheduling } from "../../../../domain/entities/EntityScheduling/Scheduling";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { schedulingTable } from "../../Schema/SchedulingSchema";
import { IRepository } from "../IRepository";
import { patientTable } from "../../Schema/PatientSchema";
import { doctorTable } from "../../Schema/DoctorSchema";

export class ConsultationSchedulingRepository implements IRepository {
    async create(scheduling: Scheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const schedulingInserted = await dbUse.insert(schedulingTable).values({
            id: scheduling.getUUIDHash(),
            date: (scheduling.date as Date),
            dateOfConfirmation: scheduling.dateOfConfirmation?.toISOString() ?? new Date().toISOString() , // Alterar o schema para poder adicionar null
            isReturn: scheduling.isReturn ?? false,
            dateOfRealizable: scheduling.dateOfRealizable ?? null,
            status: scheduling.status ?? "",
            timeOfConsultation: scheduling.timeOfConsultation ?? "00:00:00",
            doctor_id: scheduling.doctor?.getUUIDHash(),
            insurance_id:  scheduling.insurance?.getUUIDHash(),
            patient_id: scheduling.patient?.getUUIDHash(),
            specialty_id: scheduling.specialty?.getUUIDHash(),
            priceOfConsultation: scheduling.priceOfConsultation ?? 0,
            createdAt: scheduling.getCreatedAt(),
            updatedAt: scheduling.getUpdatedAt()
        }).returning()
        return schedulingInserted;
    }
    findEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    updateEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(scheduling: Scheduling, limit: number, offset: number){
        try {
            const filters = []
            let clause = or

            if(scheduling.getUUIDHash()) filters.push(eq(schedulingTable.id, scheduling.getUUIDHash()))
            if(scheduling.date) filters.push(
                sql`
                    CAST(${schedulingTable.date} AS DATE) = CAST(${scheduling.date.toISOString()} AS DATE)
                `
            )
            if(scheduling.doctor?.getUUIDHash()) filters.push(eq(schedulingTable.doctor_id, scheduling.doctor.getUUIDHash()))
            if(filters.length > 1) clause = and

            return await db
            .select({
                id: schedulingTable.id,
                date: schedulingTable.date,
                dateOfRealizable: schedulingTable.dateOfRealizable,
                dateOfConfirmation: schedulingTable.dateOfConfirmation,
                status: schedulingTable.status,
                isReturn: schedulingTable.isReturn,
                priceOfConsultation: schedulingTable.priceOfConsultation,
                timeOfConsultation: schedulingTable.timeOfConsultation,
                createdAt: schedulingTable.createdAt,
                updatedAt: schedulingTable.updatedAt,
                patient: sql`
                    (SELECT 
                        json_build_object(
                            'id', ${patientTable.id},
                            'name', ${patientTable.name},
                            'cpf', ${patientTable.cpf},
                            'sex', ${patientTable.sex},
                            'dateOfBirth', ${patientTable.dateOfBirth}
                        )
                    FROM ${patientTable}
                    WHERE
                        ${patientTable.id} = ${schedulingTable.patient_id}
                    )
                `,
                doctor: sql`
                    (SELECT 
                        json_build_object(
                            'id', ${doctorTable.id},
                            'name', ${doctorTable.name},
                            'cpf', ${doctorTable.cpf},
                            'crm', ${doctorTable.crm},
                            'sex', ${doctorTable.sex},
                            'dateOfBirth', ${doctorTable.date_of_birth}
                        )
                    FROM ${doctorTable}
                    WHERE
                        ${doctorTable.id} = ${schedulingTable.doctor_id}
                    )
                `
            })
            .from(schedulingTable)
            .where(
                clause(...filters)
            )
            .limit(limit)
            .offset(offset)

        } catch(e){
            return ResponseHandler.error("Failed to find all scheduling")
        }
    }
    
}
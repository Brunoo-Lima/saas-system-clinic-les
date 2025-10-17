import { sql } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Scheduling } from "../../../../domain/entities/EntityScheduling/Scheduling";
import db from "../../connection";
import { schedulingTable } from "../../Schema/SchedulingSchema";
import { IRepository } from "../IRepository";

export class ConsultationSchedulingRepository implements IRepository {
    async create(scheduling: Scheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const schedulingInserted = await db.insert(schedulingTable).values({
            id: scheduling.getUUIDHash(),
            date: scheduling.date as Date,
            dateOfConfirmation: scheduling.dateOfConfirmation?.toDateString() ?? "",
            isReturn: scheduling.isReturn ?? false,
            status: scheduling.status ?? "",
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
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>, limit?: number, offset?: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}
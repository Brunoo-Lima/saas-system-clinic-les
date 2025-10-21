import { eq } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Period } from "../../../../domain/entities/EntityPeriod/Period";
import db from "../../connection";
import { periodDoctorTable } from "../../Schema/PeriodSchema";
import { IRepository } from "../IRepository";

export class PeriodsRepository implements IRepository {
    async create(period: Array<Period> | Period, tx?: any, doctor_id?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const periods = Array.isArray(period) ? period : [period]
        return await dbUse.insert(periodDoctorTable).values(
            periods.map((per) => ({
                id: per?.getUUIDHash() ?? "",
                dayWeek: per?.dayWeek ?? 0,
                timeFrom: per?.timeFrom?.toString() ?? "",
                timeTo: per?.timeTo?.toString() ?? "",
                doctor_id: doctor_id ?? "",
                specialty_id: per.specialty.getUUIDHash() ?? ""
            }))
        ).returning();
    }
    async findEntity(period: Period, tx?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    async updateEntity(period: Period, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        return await dbUse.update(periodDoctorTable).set({
            dayWeek: period.dayWeek,
            specialty_id: period.specialty.getUUIDHash(),
            timeFrom: period.timeFrom,
            timeTo: period.timeTo
        }).where(
            eq(periodDoctorTable.id, period.getUUIDHash())
        ).returning()
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>, limit?: number, offset?: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}
import { and, eq, inArray, notInArray, or, SQL } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { SchedulingBlockedDays } from "../../../../domain/entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import db from "../../connection";
import { schedulingBlockedDays } from "../../Schema/SchedulingBlockedDays";
import { IRepository } from "../IRepository";

export class BlockedDatesRepository implements IRepository {
    async create(datesBlocked: SchedulingBlockedDays | Array<SchedulingBlockedDays>, tx?: any, scheduling_id?: string): Promise<any> {
        const dbUse = tx ? tx : db
        const datesToBlockFormatted = Array.isArray(datesBlocked) ? datesBlocked : [datesBlocked]
        const datesToBlockInserted = await dbUse.insert(schedulingBlockedDays).values(
            datesToBlockFormatted.map((date) => {
                return {
                    id: date?.getUUIDHash() ?? "",
                    dateBlocked: date?.dateBlocked?.toISOString() ?? "",
                    reason: date?.reason ?? "",
                    doctorScheduling_id: scheduling_id
                }
            })
        ).returning()

        return datesToBlockInserted
    }
    async findEntity(datesBlocked: SchedulingBlockedDays | Array<SchedulingBlockedDays>, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const datesFormatted = Array.isArray(datesBlocked) ? datesBlocked : [datesBlocked]
        const ids = []
        const dates = []
        
        for(const dateBl of datesFormatted){
            if(dateBl.getUUIDHash()) ids.push(dateBl.getUUIDHash())
            if(dateBl.dateBlocked) dates.push(dateBl.dateBlocked.toISOString())
        }

        return await dbUse.select().from(schedulingBlockedDays).where(
            or(
                inArray(schedulingBlockedDays.id, ids),
                inArray(schedulingBlockedDays.dateBlocked, dates)
            )
        )
    }
    async updateEntity(datesBlocked: SchedulingBlockedDays | Array<SchedulingBlockedDays>, tx?: any): Promise<any> {
        const datesBlockedFormatted = Array.isArray(datesBlocked) ? datesBlocked : [datesBlocked]
        const datesBlockedFiltered = datesBlockedFormatted.filter((dt) => dt.getUUIDHash() && dt.dateBlocked)
        const dbUse = tx ? tx : db

        const datesUpdated = await Promise.all(datesBlockedFiltered.map(async (dt) => {
            return await dbUse.update(schedulingBlockedDays).set({
                dateBlocked: dt.dateBlocked?.toISOString(),
                reason: dt.reason,
            })
            .where(
                eq(schedulingBlockedDays.id, dt.getUUIDHash())
            )
            .returning()
        }))
        return datesUpdated
    }
    async deleteEntity(datesBlocked: SchedulingBlockedDays | Array<SchedulingBlockedDays>, tx?: any, id?: string) {
        const dbUse = tx ? tx : db
        const datesBlockedFormatted = Array.isArray(datesBlocked) ? datesBlocked : [datesBlocked]
        return await dbUse.delete(schedulingBlockedDays).where(
            and(
                notInArray(schedulingBlockedDays.id, datesBlockedFormatted.map(dt => dt.getUUIDHash())),
                eq(schedulingBlockedDays.doctorScheduling_id, id ?? "")
            )
         
        ).returning()
    }
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>, limit?: number, offset?: number): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
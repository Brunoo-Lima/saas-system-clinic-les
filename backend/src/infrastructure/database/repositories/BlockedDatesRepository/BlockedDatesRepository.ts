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
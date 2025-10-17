import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import db from "../connection";
import { Pool } from "pg";
import { schedulingTable } from "../Schema/SchedulingSchema";
import { and, eq, gte, sql } from "drizzle-orm";
import { Scheduling } from "../../../domain/entities/EntityScheduling/Scheduling";

export class SchedulingQueriesDAO {
    async schedulingPerDoctor(scheduling: Scheduling, tx?: NodePgDatabase<Record<string, never>> & {$client: Pool}){
        try {
            const dbUse = tx ? tx : db
            const schedulingPerDoctor = await dbUse
            .select({
                id: schedulingTable.id,
                date: schedulingTable.date
            })
            .from(schedulingTable)
            .where(
               sql`
                    ${schedulingTable.doctor_id} = ${scheduling.doctor?.getUUIDHash()} AND
                    (${schedulingTable.id} = ${scheduling.getUUIDHash()} OR ${schedulingTable.id} IS NOT NULL) AND
                    ${schedulingTable.date} = ${scheduling.date}
               `
            )
            
            return ResponseHandler.success(schedulingPerDoctor, "Scheduling can be inserted")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
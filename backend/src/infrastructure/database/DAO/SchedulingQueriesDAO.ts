import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import db from "../connection";
import { Pool } from "pg";
import { schedulingTable } from "../Schema/SchedulingSchema";
import { sql } from "drizzle-orm";
import { Scheduling } from "../../../domain/entities/EntityScheduling/Scheduling";

export class SchedulingQueriesDAO {
    async schedulingPerDoctor(scheduling: Scheduling, tx?: NodePgDatabase<Record<string, never>> & {$client: Pool}){
        try {
            const dbUse = tx ? tx : db
            const timeOfConsultation = `${scheduling.timeOfConsultation ?? 0} hour`
            const sqlCreated = sql`
                ${schedulingTable.status} = ('PENDING') AND
                (${schedulingTable.id} = ${scheduling.getUUIDHash()} OR ${schedulingTable.id} IS NOT NULL)
            `
            if(scheduling.doctor?.getUUIDHash()) sqlCreated.append(sql` AND ${schedulingTable.doctor_id} = ${scheduling.doctor?.getUUIDHash()}`)
            if(!Number.isNaN(scheduling.date?.valueOf())) sqlCreated.append(sql` AND ((${schedulingTable.date}) + ${timeOfConsultation}::interval) >= ${scheduling.date!.toISOString()}::timestamp`)
            
            const schedulingPerDoctor = await dbUse
            .select({
                id: schedulingTable.id,
                date: schedulingTable.date,
                status: schedulingTable.status
            })
            .from(schedulingTable)
            .where(
              sqlCreated
            )

            return ResponseHandler.success(schedulingPerDoctor, "Scheduling can be inserted")
        } catch(e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
    async avgTimeOfConsultation(scheduling: Scheduling, tx?: NodePgDatabase<Record<string, never>> & {$client: Pool}){
        try {
            const  dbUse = tx ? tx : db
            const timePerConsultation = await dbUse.execute(
                sql`
                    SELECT 
                        avg(${schedulingTable.dateOfRealizable} - ${schedulingTable.date}) as avg_consultation
                    FROM ${schedulingTable}
                    WHERE 
                        (${schedulingTable.id} = ${scheduling.getUUIDHash()} OR ${schedulingTable.id} IS NOT NULL) AND
                        (${schedulingTable.specialty_id} = ${scheduling.specialty?.getUUIDHash()}) AND
                        (${schedulingTable.doctor_id} = ${scheduling.doctor?.getUUIDHash()} OR ${schedulingTable.id} IS NOT NULL) AND
                        (${schedulingTable.dateOfRealizable} IS NOT NULL) AND
                        (${schedulingTable.status} = ('CONCLUDE'))
                `
            )
            return ResponseHandler.success(...timePerConsultation.rows, "Success ! Time per consultation returned")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
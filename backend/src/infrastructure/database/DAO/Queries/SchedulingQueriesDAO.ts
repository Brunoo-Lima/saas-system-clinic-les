import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { Pool } from "pg";
import { schedulingTable } from "../../Schema/SchedulingSchema";
import { sql } from "drizzle-orm";
import { Scheduling } from "../../../../domain/entities/EntityScheduling/Scheduling";
import { patientTable } from "../../Schema/PatientSchema";
import { userTable } from "../../Schema/UserSchema";
import { doctorTable } from "../../Schema/DoctorSchema";
import { specialtyTable } from "../../Schema/SpecialtySchema";

export class SchedulingQueriesDAO {
    async schedulingPerDoctor(scheduling: Scheduling, tx?: NodePgDatabase<Record<string, never>> & { $client: Pool }) {
        try {

            const dbUse = tx ? tx : db
            const timeOfConsultation = `${scheduling.timeOfConsultation ?? 1} hour`
            const sqlCreated = sql`
                (scheduling.sch_status = 'PENDING' AND scheduling.fk_sch_doc_id = ${scheduling.doctor?.getUUIDHash()}) AND
                CAST(scheduling.sch_date AS DATE) = CAST(${scheduling.date} AS DATE) AND
                (scheduling.sch_date + ${timeOfConsultation}::interval)::time >= (${scheduling.date}::timestamp)::time
            `

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
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
    async avgTimeOfConsultation(scheduling: Scheduling, tx?: NodePgDatabase<Record<string, never>> & { $client: Pool }) {
        try {
            const dbUse = tx ? tx : db
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
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
    async getNextScheduling(tx?: NodePgDatabase<Record<string, never>> & { $client: Pool }) {
        try {
            const dbUse = tx ? tx : db
            const schedulingToConfirm = await dbUse.execute(sql`
                SELECT 
                    json_build_object(
                        'id', ${schedulingTable.id},
                        'date', ${schedulingTable.date},
                        'doctor', json_build_object(
                            'name', ${doctorTable.name}
                        ),
                        'patient', json_build_object(
                            'email', ${userTable.email},
                            'name', ${patientTable.name}
                        ),
                        'specialty', json_build_object(
                            'name', ${specialtyTable.name}
                        )
                   ) as scheduling
                FROM ${schedulingTable}
                INNER JOIN ${patientTable} ON ${patientTable.id} = ${schedulingTable.patient_id}
                INNER JOIN ${userTable} ON ${userTable.id} = ${patientTable.user_id}
                INNER JOIN ${doctorTable} ON ${doctorTable.id} = ${schedulingTable.doctor_id}
                INNER JOIN ${specialtyTable} ON ${specialtyTable.id} = ${schedulingTable.specialty_id}
                WHERE 
                    ${schedulingTable.status} = 'PENDING' 
                    AND ${schedulingTable.dateOfConfirmation} IS NULL 
                    AND EXTRACT(day FROM (${schedulingTable.date} - current_date)) <= 1;

            `)
            return schedulingToConfirm.rows
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
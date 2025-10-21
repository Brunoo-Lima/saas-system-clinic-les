import { eq, or, and, sql } from "drizzle-orm";
import { DoctorScheduling } from "../../../../domain/entities/EntityDoctorScheduling/DoctorScheduling";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import db from "../../connection";
import { doctorSchedulingTable } from "../../Schema/DoctorScheduling";
import { IRepository } from "../IRepository";
import { doctorTable } from "../../Schema/DoctorSchema";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { schedulingBlockedDays } from "../../Schema/SchedulingBlockedDays";
import { periodDoctorTable } from "../../Schema/PeriodSchema";
import { specialtyTable } from "../../Schema/SpecialtySchema";

export class SchedulingDoctorRepository implements IRepository {
    async create(schedulingDoctor: DoctorScheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const schedulingActivate = await dbUse.insert(doctorSchedulingTable).values({
            id: schedulingDoctor.getUUIDHash(),
            dateFrom: schedulingDoctor.dayFrom?.toISOString() ?? "",
            dateTo: schedulingDoctor.dayTo?.toISOString() ?? "",
            isActivate: schedulingDoctor.is_activate,
            doctor_id: schedulingDoctor.doctor?.getUUIDHash() ?? ""
        }).returning()

        return schedulingActivate
    }
    async findEntity(schedulingDoctor: DoctorScheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db;
        const filters = []

        if (schedulingDoctor.getUUIDHash()) filters.push(eq(doctorSchedulingTable.id, schedulingDoctor.getUUIDHash() ?? ""),)
        if (schedulingDoctor.doctor?.getUUIDHash()) filters.push(eq(doctorTable.id, schedulingDoctor.doctor?.getUUIDHash() ?? ""),)
        if (schedulingDoctor.doctor?.crm) filters.push(eq(doctorTable.crm, schedulingDoctor.doctor?.crm ?? ""),)
        if (schedulingDoctor.doctor?.cpf) filters.push(eq(doctorTable.cpf, schedulingDoctor.doctor?.cpf ?? ""))

        const schedulingDoctorFounded = await dbUse
            .select(
                {
                    id: doctorSchedulingTable.id,
                    dateFrom: doctorSchedulingTable.dateFrom,
                    dateTo: doctorSchedulingTable.dateTo,
                    isActivate: doctorSchedulingTable.isActivate,
                    datesBlocked: sql`
                    (SELECT 
                        json_agg(
                            json_build_object(
                                'id', ${schedulingBlockedDays.id},
                                'dateBlocked', ${schedulingBlockedDays.dateBlocked},
                                'reason', ${schedulingBlockedDays.reason}
                            )
                        )
                    FROM ${schedulingBlockedDays}
                    WHERE ${schedulingBlockedDays.doctorScheduling_id} = ${doctorSchedulingTable.id}
                    )
                `.as('datesBlocked')
                }
            )
            .from(doctorSchedulingTable)
            .leftJoin(
                doctorTable,
                eq(doctorTable.id, doctorSchedulingTable.doctor_id)
            )
            .where(
                and(
                    eq(doctorSchedulingTable.isActivate, schedulingDoctor.is_activate ?? true),
                    or(...filters)
                )
            )
            .limit(1); // garante apenas um resultado

        return schedulingDoctorFounded[0] ?? null;
    }

    async updateEntity(schedulingDoctor: DoctorScheduling,  tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        return await dbUse.update(doctorSchedulingTable).set({
            dateFrom: schedulingDoctor.dayFrom?.toISOString(),
            dateTo: schedulingDoctor.dayTo?.toISOString(),
            isActivate: schedulingDoctor.is_activate,
            updatedAt: schedulingDoctor.getUpdatedAt()
        }).where(
            eq(doctorSchedulingTable.id, schedulingDoctor.getUUIDHash())
        ).returning()
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(schedulingDoctor: DoctorScheduling, limit: number, offset: number): Promise<any> {
        try {
            const filters = []
            if (schedulingDoctor?.getUUIDHash()) filters.push(eq(doctorSchedulingTable.id, schedulingDoctor.getUUIDHash()))
            if (schedulingDoctor?.doctor?.getUUIDHash()) filters.push(eq(doctorSchedulingTable.doctor_id, schedulingDoctor.doctor.getUUIDHash()))
            const schedulingDoctorFounded = await db
                .select({
                    id: doctorSchedulingTable.id,
                    dateFrom: doctorSchedulingTable.dateFrom,
                    dateTo: doctorSchedulingTable.dateTo,
                    isActivate: doctorSchedulingTable.isActivate,
                    periodToWork: sql`
                        (SELECT 
                            json_agg(
                                json_build_object(
                                    'id', ${periodDoctorTable.id},
                                    'dayWeek', ${periodDoctorTable.dayWeek},
                                    'timeFrom', ${periodDoctorTable.timeFrom},
                                    'timeTo', ${periodDoctorTable.timeTo},
                                    'specialty', (
                                        SELECT
                                            json_build_object(
                                                'id', ${specialtyTable.id},
                                                'name', ${specialtyTable.name}
                                            )
                                        FROM ${specialtyTable}
                                        WHERE ${specialtyTable.id} = ${periodDoctorTable.specialty_id}
                                    )
                                )
                            )
                            FROM ${periodDoctorTable}
                            WHERE ${periodDoctorTable.doctor_id} = ${doctorSchedulingTable.doctor_id}
                        )
                    `,
                    datesBlocked: sql`
                    (SELECT 
                        json_agg(
                            json_build_object(
                                'id', ${schedulingBlockedDays.id},
                                'dateBlocked', ${schedulingBlockedDays.dateBlocked},
                                'reason', ${schedulingBlockedDays.reason}
                            )
                        )
                    FROM ${schedulingBlockedDays}
                    WHERE ${schedulingBlockedDays.doctorScheduling_id} = ${doctorSchedulingTable.id}
                    )
                `.as('datesBlocked')
                })
                .from(doctorSchedulingTable)
                .where(
                    or(...filters)
                ).limit(limit).offset(offset)

            return schedulingDoctorFounded
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }

}
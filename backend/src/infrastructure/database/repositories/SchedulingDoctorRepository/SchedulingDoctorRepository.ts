import { eq, or, and } from "drizzle-orm";
import { DoctorScheduling } from "../../../../domain/entities/EntityDoctorScheduling/DoctorScheduling";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import db from "../../connection";
import { doctorSchedulingTable } from "../../Schema/DoctorScheduling";
import { IRepository } from "../IRepository";
import { doctorTable } from "../../Schema/DoctorSchema";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";

export class SchedulingDoctorRepository implements IRepository {
    async create(schedulingDoctor: DoctorScheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const schedulingActivate = await dbUse.insert(doctorSchedulingTable).values({
            id: schedulingDoctor.getUUIDHash(),
            dateFrom: schedulingDoctor.dayFrom?.toDateString() ?? "",
            dateTo: schedulingDoctor.dayTo?.toDateString() ?? "",
            isActivate: schedulingDoctor.is_activate,
            doctor_id: schedulingDoctor.doctor?.getUUIDHash() ?? ""
        }).returning()

        return schedulingActivate
    }
    async findEntity(schedulingDoctor: DoctorScheduling, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db;

        const schedulingDoctorFounded = await dbUse
            .select()
            .from(doctorSchedulingTable)
            .leftJoin(
                doctorTable,
                eq(doctorTable.id, doctorSchedulingTable.doctor_id)
            )
            .where(
                and(
                    eq(doctorSchedulingTable.isActivate, schedulingDoctor.is_activate ?? true),
                    or(
                        eq(doctorSchedulingTable.id, schedulingDoctor.getUUIDHash() ?? ""),
                        eq(doctorTable.id, schedulingDoctor.doctor?.getUUIDHash() ?? ""),
                        eq(doctorTable.crm, schedulingDoctor.doctor?.crm ?? ""),
                        eq(doctorTable.cpf, schedulingDoctor.doctor?.cpf ?? "")
                    )
                )
            )
            .limit(1); // garante apenas um resultado

        return schedulingDoctorFounded[0] ?? null;
    }

    updateEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(schedulingDoctor: DoctorScheduling, limit: number, offset: number): Promise<any> {
        try {
            const filters = []
            if(schedulingDoctor?.getUUIDHash()) filters.push(eq(doctorSchedulingTable.id, schedulingDoctor.getUUIDHash()))
            if(schedulingDoctor?.doctor?.getUUIDHash()) filters.push(eq(doctorSchedulingTable.doctor_id, schedulingDoctor.doctor.getUUIDHash()))
            const schedulingDoctorFounded = await db.select()
            .from(doctorSchedulingTable)
            .where(
                or(...filters)
            ).limit(limit).offset(offset)

            return schedulingDoctorFounded
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }

}
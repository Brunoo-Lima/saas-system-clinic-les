import { and, eq, or, sql } from "drizzle-orm";
import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { clinicTable } from "../../Schema/ClinicSchema";
import { doctorTable, doctorToSpecialtyTable } from "../../Schema/DoctorSchema";
import { IRepository } from "../IRepository";
import { periodDoctorTable } from "../../Schema/PeriodSchema";

export class DoctorRepository implements IRepository {
    async create(doctor: Doctor, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const doctorInserted = await dbUse.insert(doctorTable).values({
            id: doctor.getUUIDHash() ?? "",
            cpf: doctor.cpf ?? "",
            crm: doctor.crm ?? "",
            name: doctor.name ?? "",
            phone: doctor.phone ?? "",
            sex: doctor.sex ?? "",
            address_id: doctor.address?.getUUIDHash(),
            clinic_id: doctor.clinic?.getUUIDHash(),
            date_of_birth: doctor.dateOfBirth?.toDateString() ?? "",
            user_id: doctor.user?.getUUIDHash()
        }).returning()

        await dbUse.insert(doctorToSpecialtyTable).values(doctor.specialties?.map((sp) => {
            return {
                doctor_id: doctor.getUUIDHash(),
                percent_distribution: doctor.percentDistribution,
                specialty_id: sp.getUUIDHash()
            }
        }) ?? [])

        if (doctor.periodToWork && doctor.periodToWork.length > 0) {
            await dbUse.insert(periodDoctorTable).values(
                doctor.periodToWork.map((per) => ({
                    id: per?.getUUIDHash() ?? "",
                    dayWeek: per?.dayWeek ?? 0,
                    periodType: per?.periodType ?? "",
                    timeFrom: per?.timeFrom?.toString() ?? "",
                    timeTo: per?.timeTo?.toString() ?? "",
                    doctor_id: doctor.getUUIDHash() ?? ""
                }))
            );
        }
        return doctorInserted
    }

    async findEntity(doctor: Doctor, limit?: number): Promise<any> {
        try {
            const doctorFounded = await db
            .select({
                doctor: doctorTable,
                clinic: clinicTable,
                periods: sql`json_agg(
                json_build_object(
                    'id', ${periodDoctorTable.id},
                    'periodType', ${periodDoctorTable.periodType},
                    'dayWeek', ${periodDoctorTable.dayWeek},
                    'timeFrom', ${periodDoctorTable.timeFrom},
                    'timeTo', ${periodDoctorTable.timeTo}
                )
                )`.as("periods")
            })
            .from(doctorTable)
            .innerJoin(clinicTable, eq(clinicTable.id, doctorTable.clinic_id))
            .innerJoin(periodDoctorTable, eq(periodDoctorTable.doctor_id, doctorTable.id))
            .where(
                or(
                    eq(doctorTable.id, doctor.getUUIDHash()),
                    eq(doctorTable.crm, doctor.crm ?? ""),
                    eq(doctorTable.cpf, doctor.cpf ?? "")
                )
            )
            .groupBy(doctorTable.id, clinicTable.id);
            return doctorFounded
        } catch (e) {
            return ResponseHandler.error("Failed to find the doctor")
        }
    }
    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any> {
        throw new Error("Method not implemented.");
    }

} 
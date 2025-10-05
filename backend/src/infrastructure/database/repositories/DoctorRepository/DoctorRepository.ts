import { and, eq, or, sql } from "drizzle-orm";
import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { clinicTable } from "../../Schema/ClinicSchema";
import { doctorTable, doctorToSpecialtyTable } from "../../Schema/DoctorSchema";
import { IRepository } from "../IRepository";
import { periodDoctorTable } from "../../Schema/PeriodSchema";
import { specialtyTable } from "../../Schema/SpecialtySchema";

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
                )`.as("periods"),
                specialties: sql`
                    json_agg(
                        json_build_object(
                            'id', ${specialtyTable.id},
                            'name', ${specialtyTable.name}
                        )
                    )
                `
            })
            .from(doctorTable)
            .innerJoin(periodDoctorTable, eq(periodDoctorTable.doctor_id, doctorTable.id))
            .leftJoin(
                doctorToSpecialtyTable,
                eq(doctorToSpecialtyTable.doctor_id, doctorTable.id)
            )
            .leftJoin(
                specialtyTable,
                eq(specialtyTable.id, doctorToSpecialtyTable.specialty_id)
            )
            .where(
                or(
                    eq(doctorTable.id, doctor.getUUIDHash()),
                    eq(doctorTable.crm, doctor.crm ?? ""),
                    eq(doctorTable.cpf, doctor.cpf ?? ""),
                    eq(doctorTable.name, doctor.name ?? "")
                )
            )
            .groupBy(
                doctorTable.id, 
                clinicTable.id
            );
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
    async findAllEntity(doctor: Doctor, limit: number, offset: number): Promise<any> {
        try {
            const filters = []
            if(doctor){
                filters.push(eq(doctorTable.id, doctor.getUUIDHash()))
                filters.push(eq(doctorTable.crm, doctor.crm ?? "")) 
                filters.push(eq(doctorTable.cpf, doctor.cpf ?? "")) 
            }

            const doctorsFounded = await db.select()
            .from(doctorTable)
            .where(
                or(...filters)
            ).limit(limit)
            .offset(offset)
            return doctorsFounded
        } catch(e){
            return ResponseHandler.error('Failed to find all doctors')
        }
    }

} 
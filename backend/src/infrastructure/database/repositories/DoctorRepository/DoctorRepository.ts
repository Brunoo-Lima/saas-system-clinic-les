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
import { addressTable, cityTable, countryTable, stateTable } from "../../Schema/AddressSchema";
import { userTable } from "../../Schema/UserSchema";

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
                    timeFrom: per?.timeFrom?.toString() ?? "",
                    timeTo: per?.timeTo?.toString() ?? "",
                    doctor_id: doctor.getUUIDHash() ?? "",
                    specialty_id: per.specialty.getUUIDHash() ?? ""
                }))
            );
        }
        return doctorInserted
    }

    async findEntity(doctor: Doctor, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const doctorFounded = await dbUse
        .select({
            doctor: doctorTable,
            periods: sql`json_agg(
            json_build_object(
                'id', ${periodDoctorTable.id},
                'dayWeek', ${periodDoctorTable.dayWeek},
                'timeFrom', ${periodDoctorTable.timeFrom},
                'timeTo', ${periodDoctorTable.timeTo},
                'specialty_id', ${periodDoctorTable.specialty_id}
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
                eq(doctorTable.id, doctor.getUUIDHash() ?? undefined),
                eq(doctorTable.crm, doctor.crm ?? ""),
                eq(doctorTable.cpf, doctor.cpf ?? ""),
                eq(doctorTable.name, doctor.name ?? "")
            )
        )
        .groupBy(
            doctorTable.id, 
        );
        return doctorFounded
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

            const doctorsFounded = await db.select({
                id: doctorTable.id,
                crm: doctorTable.crm,
                name: doctorTable.name,
                cpf: doctorTable.cpf,
                sex: doctorTable.sex,
                date_of_birth: doctorTable.date_of_birth,
                phone: doctorTable.phone,
                //NAO ESQUECER DOS () PARA SUBQUERY
                periods: sql`(
                    SELECT
                        json_agg(
                            json_build_object(
                                'id', ${periodDoctorTable.id},             
                                'dayWeek', ${periodDoctorTable.dayWeek},       
                                'timeFrom', ${periodDoctorTable.timeFrom},       
                                'timeTo', ${periodDoctorTable.timeTo},
                                'specialty_id', ${periodDoctorTable.specialty_id}
                            )
                        )
                    FROM ${periodDoctorTable}
                    WHERE ${periodDoctorTable.doctor_id} = ${doctorTable.id}
                )`,
                user: sql`
                    (SELECT 
                        json_build_object(
                            'id', ${userTable.id},
                            'email', ${userTable.email},
                            'status', ${userTable.status},
                            'profileCompleted', ${userTable.profileCompleted},
                            'emailVerified', ${userTable.emailVerified},
                            'username', ${userTable.username}
                        )
                    FROM ${userTable}
                    WHERE ${userTable.id} = ${doctorTable.user_id})
                `,
                address: sql`(
                    SELECT json_build_object(
                        'id', ${addressTable.id},
                        'name', ${addressTable.name},
                        'city', json_build_object(
                            'id', ${cityTable.id},
                            'name', ${cityTable.name}
                        ),
                        'state', json_build_object(
                            'id', ${stateTable.id},
                            'name', ${stateTable.name},
                            'uf', ${stateTable.uf}
                        ),
                        'country', json_build_object(
                            'id', ${countryTable.id},
                            'name', ${countryTable.name}
                        )
                    )
                    FROM ${addressTable}
                    LEFT JOIN ${cityTable} ON ${cityTable.id} = ${addressTable.city_id}
                    LEFT JOIN ${stateTable} ON ${stateTable.id} = ${cityTable.state_id}
                    LEFT JOIN ${countryTable} ON ${countryTable.id} = ${stateTable.country_id} 
                    WHERE ${addressTable.id} = ${doctorTable.address_id}
                )
                `,
            })
            .from(doctorTable)
            .where(
                or(...filters)
            ).limit(limit)
            .offset(offset)
            return doctorsFounded
        } catch(e){
            console.log(e)
            return ResponseHandler.error('Failed to find all doctors')
        }
    }

} 
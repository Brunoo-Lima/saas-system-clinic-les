import { and, eq, notInArray, or, sql } from "drizzle-orm";
import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { doctorTable, doctorToSpecialtyTable } from "../../Schema/DoctorSchema";
import { IRepository } from "../IRepository";
import { periodDoctorTable } from "../../Schema/PeriodSchema";
import { specialtyTable } from "../../Schema/SpecialtySchema";
import { addressTable } from "../../Schema/AddressSchema";
import { userTable } from "../../Schema/UserSchema";
import { doctorSchedulingTable } from "../../Schema/DoctorScheduling";

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
            date_of_birth: doctor.dateOfBirth?.toISOString() ?? "",
            user_id: doctor.user?.getUUIDHash()
        }).returning()

        await dbUse.insert(doctorToSpecialtyTable).values(doctor.specialties?.map((sp) => {
            return {
                doctor_id: doctor.getUUIDHash(),
                percent_distribution: doctor.percentDistribution,
                specialty_id: sp.getUUIDHash()
            }
        }) ?? [])

        return doctorInserted
    }

    async findEntity(doctor: Doctor, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const filters = []
        
        if(doctor?.crm) filters.push(eq(doctorTable.crm, doctor.crm))
        if(doctor?.cpf) filters.push(eq(doctorTable.cpf, doctor.cpf))
        if(doctor?.name) filters.push(eq(doctorTable.name, doctor.name))

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
            .leftJoin(periodDoctorTable, eq(periodDoctorTable.doctor_id, doctorTable.id))
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
                    ...filters
                )
            )
            .groupBy(
                doctorTable.id,
            );
        return doctorFounded
    }
    async updateEntity(doctor: Doctor, tx?: any): Promise<any> {

        const dbUse = tx ? tx : db
        let specialtiesToDoctorUpdated;

        const doctorUpdated = await dbUse.update(doctorTable).set({
            cpf: doctor.cpf || undefined,
            crm: doctor.crm || undefined,
            date_of_birth: doctor.dateOfBirth?.toISOString(),
            name: doctor.name || undefined,
            phone: doctor.phone || undefined,
            sex: doctor.sex || undefined,
            updatedAt: doctor.getUpdatedAt()

        }).where(
            eq(doctorTable.id, doctor.getUUIDHash())
        ).returning()

        if (doctor.specialties) specialtiesToDoctorUpdated = await this.specialtiesToDoctorSync(doctor, dbUse)

        return {
            updated: {
                doctor: doctorUpdated,
                specialties: specialtiesToDoctorUpdated?.updated,
            },
            deleted: {
                specialties: specialtiesToDoctorUpdated?.deleted
            }
        }
    }

    async specialtiesToDoctorSync(doctor: Doctor, tx?: any) {
        const dbUse = tx ? tx : db
        const specialtiesRemoved = await dbUse.delete(doctorToSpecialtyTable).where(
            and(
                notInArray(doctorToSpecialtyTable.specialty_id, doctor.specialties?.map((spe) => spe.getUUIDHash()) ?? []),
                eq(doctorToSpecialtyTable.doctor_id, doctor.getUUIDHash())
            )

        ).returning()

        const specialtiesUpdated = await Promise.all(doctor.specialties?.map(async (sp) => {
            return await dbUse.update(doctorToSpecialtyTable)
                .set({
                    percent_distribution: doctor.percentDistribution
                })
                .where( // Se a modality nao existir, nao será atualziada de todo modo, ou seja, será ignorada.
                    eq(doctorToSpecialtyTable.specialty_id, sp.getUUIDHash())).returning();
        }) ?? [])

        return {
            updated: specialtiesUpdated.flat(),
            deleted: specialtiesRemoved
        }
    }

    async addSpecialty(doctor: Doctor, tx?: any) {
        const dbUse = tx ? tx : db
        return await dbUse.insert(doctorToSpecialtyTable).values(doctor.specialties?.map((sp) => {
            return {
                percent_distribution: doctor.percentDistribution,
                specialty_id: sp.getUUIDHash(),
                doctor_id: doctor.getUUIDHash()
            }
        }) ?? []).returning()
    }

    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(doctor: Doctor, limit: number, offset: number): Promise<any> {
        try {
            const filters = []
            if (doctor?.getUUIDHash()) filters.push(eq(doctorTable.id, doctor.getUUIDHash()))
            if (doctor?.crm) filters.push(eq(doctorTable.id, doctor.crm))
            if (doctor?.cpf) filters.push(eq(doctorTable.id, doctor.cpf))
            if (doctor?.user?.getUUIDHash()) filters.push(eq(doctorTable.user_id, doctor.user?.getUUIDHash()))

            const doctorsFounded = await db.select({
                id: doctorTable.id,
                crm: doctorTable.crm,
                name: doctorTable.name,
                cpf: doctorTable.cpf,
                sex: doctorTable.sex,
                dateOfBirth: sql`CAST(${doctorTable.date_of_birth} AS DATE)`,
                phone: doctorTable.phone,
                specialties: sql`(
                    SELECT 
                        json_agg(
                            json_build_object(
                                'id', ${doctorToSpecialtyTable.specialty_id},
                                'name', ${specialtyTable.name},
                                'percentDistribution', ${doctorToSpecialtyTable.percent_distribution}
                            )
                        )
                    FROM ${doctorToSpecialtyTable}
                    INNER JOIN ${specialtyTable} ON ${specialtyTable.id} = ${doctorToSpecialtyTable.specialty_id}
                    WHERE ${doctorToSpecialtyTable.doctor_id} = ${doctorTable.id}
                )`,
                periodToWork: sql`(
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
                user: sql`json_build_object(
                    'id', ${userTable.id},
                    'email', ${userTable.email},
                    'status', ${userTable.status},
                    'password', ${userTable.password},
                    'profileCompleted', ${userTable.profileCompleted},
                    'emailVerified', ${userTable.emailVerified},
                    'username', ${userTable.username}
                )`,
                address: sql`(
                    SELECT json_build_object(
                        'id', ${addressTable.id},
                        'name', ${addressTable.name},
                        'street', ${addressTable.street},
                        'cep', ${addressTable.cep},
                        'number', ${addressTable.number},
                        'neighborhood', ${addressTable.neighborhood},
                        'city', ${addressTable.city},
                        'state', ${addressTable.state},
                        'uf', ${addressTable.uf},
                        'country', ${addressTable.country}
                    )
                    FROM ${addressTable}
                    WHERE ${addressTable.id} = ${doctorTable.address_id}
                )
                `,
            })
            .from(doctorTable)
            .where(or(...filters))
            .innerJoin(userTable, 
                eq(userTable.id, doctorTable.user_id)
            )
            .limit(limit)
            .offset(offset)
            return doctorsFounded
        } catch (e) {
            console.log(e)
            return ResponseHandler.error('Failed to find all doctors')
        }
    }

} 
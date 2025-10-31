import { and, eq, ilike, inArray, isNotNull, or, sql } from "drizzle-orm";
import { Specialty } from "../../../../domain/entities/EntitySpecialty/Specialty";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { specialtyTable } from "../../Schema/SpecialtySchema";
import { IRepository } from "../IRepository";
import { clinicToSpecialtyTable } from "../../Schema/ClinicSchema";

export class SpecialtyRepository implements IRepository {
    async create(specialty: Specialty , id?: string): Promise<any> {
        try {

            const specialtiesSaved = await db.insert(specialtyTable).values({
                id: specialty.getUUIDHash(),
                name: specialty.name ?? ""
            }).returning({
                id: specialtyTable.id,
                name: specialtyTable.name
            })
            return specialtiesSaved

        } catch (e) {
            return ResponseHandler.error(["Failed to save a specialty"])
        }
    }
    async findEntity(specialties: Specialty | Array<Specialty>): Promise<any> {
        try {
            if (Array.isArray(specialties)) {
                const namesMapped = specialties
                    .filter((s) => !!s.name)
                    .map((s) => ilike(specialtyTable.name, s.name as string));
                const specialtiesFounded = await db.select().from(specialtyTable)
                    .where(
                        or(
                            ...namesMapped,
                            inArray(
                                specialtyTable.id,
                                specialties
                                    .map((s) => s.getUUIDHash())
                                    .filter((id) => !!id)
                            )
                        )
                    )
                return specialtiesFounded;
            }
            return await db.select().from(specialtyTable)
                .where(
                    or(
                        eq(specialtyTable.id, specialties.getUUIDHash() ?? undefined),
                        ilike(specialtyTable.name, specialties.name ?? ""),
                        or(
                            and(
                                eq(specialtyTable.id, specialties.getUUIDHash() ?? undefined),
                                ilike(specialtyTable.name, specialties.name ?? ""),
                            )
                        )
                    )
                )

        } catch (e) {
            return ResponseHandler.error("Failed to find the specialty")
        }
    }
    async updateEntity(specialties: Array<Specialty>, tx?: any){
        const dbUse = tx ? tx : db
        const specialtiesInserted = await Promise.all(
            specialties.map(async (sp) =>
                await dbUse.update(specialtyTable)
                    .set({
                        name: sp.name,
                        updatedAt: sp.getUpdatedAt()
                    })
                    .where(eq(specialtyTable.id, sp.getUUIDHash())).returning() // condição para atualizar o registro correto
            )
        );
        return specialtiesInserted
    }
    async deleteEntity(specialties: Array<Specialty> | Specialty, id?: string){
        try {
            const specialtiesFormatted = Array.isArray(specialties) ? specialties : [specialties]
            return await db.delete(specialtyTable).where(
                inArray(specialtyTable.id, specialtiesFormatted.map((sp) => sp.getUUIDHash()).filter(sp => sp))
            )
        } catch(e) {
            const error = {...(e as any)}
            const errorCode = error?.cause?.code
            return ResponseHandler.error(errorCode === "23503" ? "You cannot deleted this entity because this linked with outer entity, remove the link and delete again !":"Failed to deleted the specialty")
        }
    }
    async findAllEntity(specialties: Array<Specialty>, limit: number, offset: number, clinic_id?: string) {
        try {
            const filters:any = []
            if(Array.isArray(specialties) && specialties.length){
                filters.push(inArray(specialtyTable.id, specialties.map((sp) => sp.getUUIDHash())))
                filters.push(inArray(specialtyTable.name, specialties.map((sp) => sp.name ?? "")))
            }else{
                filters.push(isNotNull(specialtyTable.id))
            }
            return await db
                .select({
                    id: specialtyTable.id,
                    name: specialtyTable.name,
                    price: clinicToSpecialtyTable.price
                })
                .from(specialtyTable)
                .innerJoin(
                    clinicToSpecialtyTable,
                    eq(clinicToSpecialtyTable.clinic_id, clinic_id || "")
                )
                .where(
                    or(...filters)
                )
                .groupBy(clinicToSpecialtyTable.price, specialtyTable.id)
                .limit(limit)
                .offset(offset)

        } catch (e) {
            console.log(e)
            return ResponseHandler.error("Failed to find the specialties")
        }
    }

}
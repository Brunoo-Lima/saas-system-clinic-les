import { and, DrizzleError, eq, ilike, inArray, isNotNull, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Specialty } from "../../../../domain/entities/EntitySpecialty/Specialty";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { specialtyTable } from "../../Schema/SpecialtySchema";
import { IRepository } from "../IRepository";

export class SpecialtyRepository implements IRepository {
    async create(specialties: Array<Specialty>, id?: string): Promise<any> {
        try {

            const specialtiesMapped = specialties.map((s) => ({ id: s.getUUIDHash(), name: s.name! }))
            const specialtiesSaved = await db.insert(specialtyTable).values(specialtiesMapped).returning({
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
            specialties.map((sp) =>
                dbUse.update(specialtyTable)
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
    async findAllEntity(specialties: Array<Specialty>, limit: number, offset: number) {
        try {
            const filters:any = []
            if(Array.isArray(specialties) && specialties.length){
                filters.push(inArray(specialtyTable.id, specialties.map((sp) => sp.getUUIDHash())))
                filters.push(inArray(specialtyTable.name, specialties.map((sp) => sp.name ?? "")))
            }else{
                filters.push(isNotNull(specialtyTable.id))
            }
            return await db
                .select()
                .from(specialtyTable)
                .where(
                    or(...filters)
                )
                .limit(limit)
                .offset(offset)

        } catch (e) {
            console.log(e)
            return ResponseHandler.error("Failed to find the specialties")
        }
    }

}
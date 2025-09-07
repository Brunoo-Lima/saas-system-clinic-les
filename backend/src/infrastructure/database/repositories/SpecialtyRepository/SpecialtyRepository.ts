import { and, eq, inArray, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Specialty } from "../../../../domain/entities/EntitySpecialty/Specialty";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { specialtyTable } from "../../schema";
import { IRepository } from "../IRepository";

export class SpecialtyRepository implements IRepository {
    async create(specialties: Array<Specialty>, id?: string): Promise<any> {
        try {

            const specialtiesMapped = specialties.map((s) => ({ id: s.getUUIDHash(), name: s.name!, price: s.price }))
            const specialtiesSaved = await db.insert(specialtyTable).values(specialtiesMapped).returning({
                id: specialtyTable.id
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
                    .map((s) => s.name as string);
                const specialtiesFounded = await db.select().from(specialtyTable)
                    .where(
                        or(
                            inArray(specialtyTable.name, namesMapped),
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
                        eq(specialtyTable.id, specialties.getUUIDHash()),
                        eq(specialtyTable.name, specialties.name ?? ""),
                        eq(specialtyTable.price, specialties.price ?? 0),
                        or(
                            and(
                                eq(specialtyTable.id, specialties.getUUIDHash()),
                                eq(specialtyTable.name, specialties.name ?? ""),
                                eq(specialtyTable.price, specialties.price ?? 0)
                            )
                        )
                    )
                )

        } catch (e) {
            return ResponseHandler.error("Failed to find the specialty")
        }
    }
    updateEntity(entity: EntityDomain, id?: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity: EntityDomain, id?: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
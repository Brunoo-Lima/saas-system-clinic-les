import { and, eq, inArray, notInArray, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { modalityTable } from "../../Schema/ModalitiesSchema";
import { IRepository } from "../IRepository";

export class ModalityRepository implements IRepository {
    async create(modalities: Modality | Array<Modality>, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        if (Array.isArray(modalities)) {
            return db.insert(modalityTable).values(modalities.map((mod) => {
                return {
                    id: mod.getUUIDHash(),
                    name: mod.name
                }
            })).returning()
        }
        const modalitiesInserted = await dbUse.insert(modalityTable).values({
            id: modalities.getUUIDHash(),
            name: modalities.name
        }).returning()
        return modalitiesInserted
    }
    async findEntity(modality: Modality | Array<Modality>, limit?: number): Promise<any> {
        try {
            let whereCondition;
            if (Array.isArray(modality)) {
                whereCondition = or(
                    inArray(modalityTable.id, modality.map((mod) => mod.getUUIDHash())),
                    inArray(modalityTable.name, modality.map((mod) => mod.name)),
                );
            } else {
                whereCondition = or(
                    eq(modalityTable.name, modality.name),
                    eq(modalityTable.id, modality.getUUIDHash())
                );
            }
            const modalityFounded = await db.select().from(modalityTable).where(whereCondition)
            return modalityFounded
        } catch (e) {
            return ResponseHandler.error("Failed to find the modality")
        }
    }
    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(modality: Array<Modality>) {
        try {
            const modalityFiltered = modality.filter(
                (mod) => (mod.name && mod.name !== "") || (mod.getUUIDHash() && mod.getUUIDHash() !== "")
            );

            // Nenhum filtro -> retorna tudo
            if (modalityFiltered.length === 0) {
                return await db.select().from(modalityTable);
            }

            const conditions = modalityFiltered.map((mod) => {
                const id = mod.getUUIDHash();
                const name = mod.name;

                if (id && name) {
                    // se tiver os dois -> AND
                    return and(eq(modalityTable.id, id), eq(modalityTable.name, name));
                } else if (id) {
                    // só id
                    return eq(modalityTable.id, id);
                } else if (name) {
                    // só name
                    return eq(modalityTable.name, name);
                }
            });

            const modalitiesFounded = await db
                .select()
                .from(modalityTable)
                .where(or(...conditions));

            return modalitiesFounded;
        } catch (e) {
            return ResponseHandler.error("Failed to find the modalities");
        }
    }
}
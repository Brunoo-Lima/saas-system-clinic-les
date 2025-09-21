import { and, eq, inArray, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { modalityTable } from "../../Schema/ModalitiesSchema";
import { IRepository } from "../IRepository";

export class ModalityRepository implements IRepository {
    async create(modalities: Modality , tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
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
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
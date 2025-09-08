import { eq } from "drizzle-orm";
import { Neighborhood } from "../../../../domain/entities/EntityAddress/Neighborhood";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { neighborhoodTable } from "../../schema";
import { IRepository } from "../IRepository";

export class NeighborhoodRepository implements IRepository {
    async create(neighborhood: Neighborhood): Promise<any> {
        try {
            const neighborhoodInserted = await db.insert(neighborhoodTable).values({
                id: neighborhood.getUUIDHash() ?? "",
                name: neighborhood.name ?? "",
                city_id: neighborhood.city?.getUUIDHash()
            })
            return neighborhoodInserted
            
        } catch(e){
            return ResponseHandler.error("Failed to create Neighborhood")
        }
    }
    async findEntity(neighborhood: Neighborhood): Promise<any> {
        try {
            const neighborhoods = await db.select().from(neighborhoodTable)
            .where(
                eq(neighborhoodTable.name, neighborhood.name ?? "")
            )
            return neighborhoods
        } catch(e) {
            return ResponseHandler.error("Failed to find the neighborhood !")
        }
    }
    updateEntity(entity: EntityDomain): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    
}
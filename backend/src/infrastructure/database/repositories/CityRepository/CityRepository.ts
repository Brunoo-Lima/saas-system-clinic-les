import { eq, ilike,  or} from "drizzle-orm";
import { City } from "../../../../domain/entities/EntityAddress/City";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { cityTable, stateTable } from "../../schema";
import { IRepository } from "../IRepository";

export class CityRepository implements IRepository {
    async create(city: City): Promise<any> {
        try {
            const cityInserted = await db.insert(cityTable).values({
                id: city.getUUIDHash() ?? "",
                cep: city.cep ?? "",
                name: city.name ?? "",
                state_id: city.state?.getUUIDHash()
            })
            return cityInserted
        } catch(e) {
            return ResponseHandler.error("Failed to create a City")
        }
    }
    async findEntity(city: City): Promise<any> {
        try {
            const filters = []
            if (city.getUUIDHash()) filters.push(eq(cityTable.id, city.getUUIDHash()))
            if (city.name) filters.push(ilike(cityTable.name, city.name ?? ""))

            const countriesFounded = await db.select().from(cityTable)
                .where(
                    or(...filters)
                ).leftJoin(stateTable, 
                    eq(stateTable.id, cityTable.id)
                )
            return countriesFounded
        } catch(e){ 
            return ResponseHandler.error("Failed to find the City")
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
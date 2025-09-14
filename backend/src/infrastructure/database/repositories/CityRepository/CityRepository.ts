import { eq, ilike,  or} from "drizzle-orm";
import { City } from "../../../../domain/entities/EntityAddress/City";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { cityTable, stateTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";

export class CityRepository implements IRepository {
    async create(city: City, tx: any): Promise<any> {
        try {
            const dbUse = tx ? tx : db
            return await dbUse.insert(cityTable).values({
                id: city.getUUIDHash() ?? "",
                name: city.name ?? "",
                state_id: city.state?.getUUIDHash()
            }).returning()
        } catch(e) {
            return ResponseHandler.error("Failed to create a City")
        }
    }
    async findEntity(city: City): Promise<any> {
        try {
            const filters = []
            if (city.getUUIDHash()) filters.push(eq(cityTable.id, city.getUUIDHash()))
            if (city.name) filters.push(ilike(cityTable.name, city.name ?? ""))

            const citiesFounded = await db.select().from(cityTable)
                .where(
                    or(...filters)
                ).leftJoin(stateTable, 
                    eq(stateTable.id, cityTable.id)
                )
            return citiesFounded
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
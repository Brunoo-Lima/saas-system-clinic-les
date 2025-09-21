import { eq, ilike, or } from "drizzle-orm";
import { State } from "../../../../domain/entities/EntityAddress/State";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { countryTable, stateTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";

export class StateRepository implements IRepository{
    async create(state: State, tx: any): Promise<any> {
        try {
            const dbUse = tx ? tx : db
            return await dbUse.insert(stateTable).values({
                id: state.getUUIDHash() ?? "",
                name: state.name ?? "",
                uf: state.uf ?? "",
                country_id: state.country?.getUUIDHash()
            }).returning()
        } catch(e) {
            return ResponseHandler.error("Failed to create a state")
        }
    }
    async findEntity(state: State): Promise<any> {
        try {
            const filters = []
            if(state.getUUIDHash()) filters.push(eq(stateTable.id, state.getUUIDHash()))
            if(state.name) filters.push(ilike(stateTable.name, state.name))
            if(state.country?.getUUIDHash()) filters.push(eq(countryTable.id, state.country.getUUIDHash()))
                
            const statesFounded = await db.select().from(stateTable)
            .where(
                or(...filters)
            ).leftJoin(countryTable, 
                eq(countryTable.id, stateTable.id)
            )
            return statesFounded[0]?.state
        } catch (e) {
            return ResponseHandler.error("Failed to find a state")
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
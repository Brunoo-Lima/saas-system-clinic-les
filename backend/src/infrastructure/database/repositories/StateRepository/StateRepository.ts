import { eq, ilike, or } from "drizzle-orm";
import { State } from "../../../../domain/entities/EntityAddress/State";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { countryTable, stateTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";

export class StateRepository implements IRepository{
    async create(state: State, tx: any): Promise<any> {
  
        const dbUse = tx ? tx : db
        return await dbUse.insert(stateTable).values({
            id: state.getUUIDHash() ?? "",
            name: state.name ?? "",
            uf: state.uf ?? "",
            country_id: state.country?.getUUIDHash()
        }).returning()

    }
    async findEntity(state: State): Promise<any> {
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
    }
    async updateEntity(state: State, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        return await dbUse.update(stateTable).set({
            name: state.name,
            uf: state.uf
        }).where(
            eq(stateTable.id, state.getUUIDHash())
        )
        .returning()
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    
}
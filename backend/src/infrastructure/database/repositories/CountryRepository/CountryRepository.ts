import { eq, ilike, or } from "drizzle-orm";
import { Country } from "../../../../domain/entities/EntityAddress/Country";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { countryTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";

export class CountryRepository implements IRepository {
    async create(country: Country, tx: any): Promise<any> {
    
        const dbUse = tx ? tx : db
        const countryDb = await dbUse.insert(countryTable).values({
            id: country.getUUIDHash() ?? "",
            name: country.name ?? ""
        }).returning()
        return countryDb
      
    }
    async findEntity(country: Country): Promise<any> {
     
        const filters = []
        if (country.getUUIDHash()) filters.push(eq(countryTable.id, country.getUUIDHash()))
        if (country.name) filters.push(ilike(countryTable.name, country.name ?? ""))

        const countriesFounded = await db.select().from(countryTable)
            .where(
                or(...filters)
            )
        return countriesFounded
    
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
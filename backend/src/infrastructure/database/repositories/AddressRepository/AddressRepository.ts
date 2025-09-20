import { eq, ilike, or } from "drizzle-orm";
import { Address } from "../../../../domain/entities/EntityAddress/Address";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { addressTable } from "../../Schema/AddressSchema";
import { IRepository } from "../IRepository";

export class AddressRepository implements IRepository {
    async create(address: Address, tx: any): Promise<any> {
        const dbUse = tx ? tx : db
        const addressInserted = await dbUse.insert(addressTable).values({
            id: address.getUUIDHash(),
            name: address.nameAddress as string,
            number: address.number as string,
            cep: address.cep as string,
            street: address.street as string,
            city_id: address.city?.getUUIDHash()
        }).returning()

        return addressInserted

    }
    async findEntity(address: Address): Promise<any> {
        try {
            const filters = [
                ilike(addressTable.name, address.nameAddress ?? "")
            ]
            const addressId = address.getUUIDHash()

            if (addressId && addressId !== "") filters.push(eq(addressTable.id, addressId))
            const addressesFounded = await db.select().from(addressTable)
                .where(
                    or(
                        ...filters
                    )
                )
            return addressesFounded
        } catch (e) {
            return ResponseHandler.error("Failed to find a address")
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
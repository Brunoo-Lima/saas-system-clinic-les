import { and, eq, ilike, or, sql } from "drizzle-orm";
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
            neighborhood: address.neighborhood ?? "",
            cep: address.cep as string,
            city: address.city?.name || "",
            state: address.city?.state?.name || "",
            country: address.city?.state?.country?.name || "",
            uf: address.city?.state?.uf || "",
            street: address.street as string
        }).returning()

        return addressInserted

    }
    async findEntity(address: Address, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const filters = [
            ilike(addressTable.name, address.nameAddress ?? ""),
            eq(addressTable.id, address.getUUIDHash())
        ]

        const addressesFounded = await dbUse.select().from(addressTable)
            .where(
                or(
                    ...filters
                )
            )
        return addressesFounded

    }
    async updateEntity(address: Address, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        
        return await dbUse.update(addressTable).set({
            cep: address.cep || undefined,
            name: address.nameAddress || undefined,
            neighborhood: address.neighborhood || undefined,
            number: address.number || undefined,
            street: address.street || undefined,
            city: address.city?.name || undefined,
            state: address.city?.state?.name || undefined,
            country: address.city?.state?.country?.name || undefined,
            uf: address.city?.state?.uf || undefined,
            updatedAt: address.getUpdatedAt()

        }).where(
            eq(addressTable.id, address.getUUIDHash())
        ).returning()
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(address: Address, tx?: any) {
        try {
            const dbUse = tx ? tx : db
            return await dbUse.select().from(addressTable).where(
                or(
                    eq(addressTable.id, address.getUUIDHash()),
                    ilike(addressTable.name, address.nameAddress ?? "")
                )
            )
        } catch (e) {
            return ResponseHandler.error("Failed to find the address")
        }
    }

}
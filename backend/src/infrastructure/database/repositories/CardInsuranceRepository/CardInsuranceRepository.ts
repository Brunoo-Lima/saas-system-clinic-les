import { eq, inArray, or } from "drizzle-orm";
import { CardInsurance } from "../../../../domain/entities/EntityCardInsurance/CardInsurance";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { cardInsuranceTable, cartToModalityTable } from "../../Schema/CardInsuranceSchema";
import { IRepository } from "../IRepository";

export class CardInsuranceRepository implements IRepository {
    async create(cartInsurance: CardInsurance | Array<CardInsurance>, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const cartInsurancesFiltered = Array.isArray(cartInsurance) ? cartInsurance : [cartInsurance]

        const cartInsuranceInserted = await dbUse.insert(cardInsuranceTable).values(cartInsurancesFiltered.map((ct) => {
            return {
                id: ct.getUUIDHash() ?? "",
                cartNumber: ct.cardNumber ?? "",
                validate: ct.validate?.toString() ?? "",
                insurance_id: ct.insurance?.getUUIDHash()
            }
        })).returning()

        await dbUse.insert(cartToModalityTable).values(cartInsurancesFiltered.map((ct) => {
            return {
                cartInsurance_id: ct.getUUIDHash(),
                modality_id: ct.modality?.getUUIDHash()
            }
        }))

        return cartInsuranceInserted[0]
    }
    async findEntity(cartInsurance: CardInsurance | Array<CardInsurance>): Promise<any> {
        try {
            const whereConditions = []
            if(Array.isArray(cartInsurance)){
                whereConditions.push(
                    inArray(cardInsuranceTable.id, cartInsurance.map((ins) => ins.getUUIDHash())),
                    inArray(cardInsuranceTable.cartNumber, cartInsurance.map((ins) => ins.cardNumber ?? ""))
                )
            } else {
                whereConditions.push(
                    eq(cardInsuranceTable.id, cartInsurance.getUUIDHash()),
                    eq(cardInsuranceTable.cartNumber, cartInsurance.cardNumber ?? "")
                )
            }
            const cartInsuranceFounded = await db.select().from(cardInsuranceTable).where(
                or( ...whereConditions)
            )
            return cartInsuranceFounded
        } catch (e) {
            return ResponseHandler.error("Failed to find the cart insurance")
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
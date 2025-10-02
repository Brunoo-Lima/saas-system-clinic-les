import { eq, inArray, or } from "drizzle-orm";
import { CardInsurance } from "../../../../domain/entities/EntityCardInsurance/CardInsurance";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { cardInsuranceTable, cardToModalityTable } from "../../Schema/CardInsuranceSchema";
import { IRepository } from "../IRepository";

export class CardInsuranceRepository implements IRepository {
    async create(cardInsurance: CardInsurance | Array<CardInsurance>, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        const cardInsurancesFiltered = Array.isArray(cardInsurance) ? cardInsurance : [cardInsurance]

        const cardInsuranceInserted = await dbUse.insert(cardInsuranceTable).values(cardInsurancesFiltered.map((ct) => {
            return {
                id: ct.getUUIDHash() ?? "",
                cardNumber: ct.cardNumber ?? "",
                validate: ct.validate?.toString() ?? "",
                insurance_id: ct.insurance?.getUUIDHash()
            }
        })).returning()

        await dbUse.insert(cardToModalityTable).values(cardInsurancesFiltered.map((ct) => {
            return {
                cardInsurance_id: ct.getUUIDHash(),
                modality_id: ct.modality?.getUUIDHash()
            }
        }))

        return cardInsuranceInserted[0]
    }
    async findEntity(cardInsurance: CardInsurance | Array<CardInsurance>): Promise<any> {
        try {
            const whereConditions = []
            if(Array.isArray(cardInsurance)){
                whereConditions.push(
                    inArray(cardInsuranceTable.id, cardInsurance.map((ins) => ins.getUUIDHash())),
                    inArray(cardInsuranceTable.cardNumber, cardInsurance.map((ins) => ins.cardNumber ?? ""))
                )
            } else {
                whereConditions.push(
                    eq(cardInsuranceTable.id, cardInsurance.getUUIDHash()),
                    eq(cardInsuranceTable.cardNumber, cardInsurance.cardNumber ?? "")
                )
            }
            const cardInsuranceFounded = await db.select().from(cardInsuranceTable).where(
                or( ...whereConditions)
            )
            return cardInsuranceFounded
        } catch (e) {
            return ResponseHandler.error("Failed to find the card insurance")
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
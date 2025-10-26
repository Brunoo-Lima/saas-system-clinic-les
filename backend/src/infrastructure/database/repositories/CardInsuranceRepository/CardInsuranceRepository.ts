import { eq, inArray, notInArray, or } from "drizzle-orm";
import { CardInsurance } from "../../../../domain/entities/EntityCardInsurance/CardInsurance";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { cardInsuranceTable } from "../../Schema/CardInsuranceSchema";
import { IRepository } from "../IRepository";

export class CardInsuranceRepository implements IRepository {
    async create(cardInsurance: CardInsurance | Array<CardInsurance>, tx?: any, patient_id: string = ""): Promise<any> {
        const dbUse = tx ? tx : db
        const cardInsurancesFiltered = Array.isArray(cardInsurance) ? cardInsurance : [cardInsurance]
        const cardInsuranceInserted = await dbUse.insert(cardInsuranceTable).values(cardInsurancesFiltered.map((ct) => {
            return {
                id: ct.getUUIDHash() ?? "",
                cardNumber: ct.cardNumber ?? "",
                validate: ct.validate?.toISOString() ?? "",
                insurance_id: ct.insurance?.getUUIDHash(),
                patient_id: patient_id,
                modality_id: ct.modality?.getUUIDHash()
            }
        })).returning()

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
    async updateEntity(cardInsurance: CardInsurance | Array<CardInsurance>, tx?: any): Promise<any> {
        const cardInsuranceFormatted = Array.isArray(cardInsurance) ? cardInsurance : [cardInsurance]
        const dbUse = tx ? tx : db
        const cardInsurancesDeleted = await dbUse.delete(cardInsuranceTable).where(
            notInArray(cardInsuranceTable.id, cardInsuranceFormatted.filter((cd) => cd.getUUIDHash()).map((cd) => cd.getUUIDHash())),
        )

        const cardInsuranceUpdated = await Promise.all(cardInsuranceFormatted.filter((cd) => cd.getUUIDHash()).map(async (cd) => {
            return await dbUse.update(cardInsuranceTable).set({
                cardNumber: cd.cardNumber || undefined,
                insurance_id: cd.insurance?.getUUIDHash() || undefined,
                modality_id: cd.modality?.getUUIDHash() || undefined,
                updatedAt: cd.getUpdatedAt() || undefined,
                validate: cd.validate ? new Date(cd.validate).toISOString() : undefined
            }).where(
                eq(cardInsuranceTable.id, cd.getUUIDHash())
            ).returning()
        }))

        return {
            updated: cardInsuranceUpdated,
            deleted: cardInsurancesDeleted.rows
        }
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
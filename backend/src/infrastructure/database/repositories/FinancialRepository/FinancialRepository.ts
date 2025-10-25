import { eq, or } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Financial } from "../../../../domain/entities/EntityFinancial/Financial";
import db from "../../connection";
import { financialTable } from "../../Schema/FinancialSchema";
import { IRepository } from "../IRepository";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";

export class FinancialRepository implements IRepository{
    async create(financial: Financial, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        return await dbUse.insert(financialTable).values({
            id: financial.getUUIDHash(),
            date: financial.date?.toISOString() ?? "",
            totalDistributionClinic: financial.totalClinic,
            totalDistributionDoctor: financial.totalDoctor ?? 0,
            totalDistributionInsurance: financial.totalInsurance ?? 0,
            scheduling_id: financial.scheduling?.getUUIDHash(),
            total: financial.total ?? 0
        }).returning()
    }
    async findEntity(financial: Financial, tx?: any): Promise<any> {
        const dbUse = tx ? tx : db
        return await dbUse.select().from(financialTable).where(
            or(
                eq(financialTable.id, financial.getUUIDHash()),
                eq(financialTable.scheduling_id, financial.scheduling?.getUUIDHash() ?? "")
            )
        )
    }
    updateEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    deleteEntity(entity: EntityDomain | Array<EntityDomain>, tx?: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findAllEntity(financial: Financial, limit: number, offset: number): Promise<any> {
        try {
            const filters = []
            if(financial?.getUUIDHash()) filters.push(eq(financialTable.id, financial.getUUIDHash()))
            if(financial?.date) filters.push(eq(financialTable.date, financial.date.toISOString()))

            return await db.select().from(financialTable)
            .where(or(...filters))
            .limit(limit)
            .offset(offset)
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
    
}
import { eq, or, SQL, sql } from "drizzle-orm";
import { EntityDomain } from "../../../../domain/entities/EntityDomain";
import { Financial } from "../../../../domain/entities/EntityFinancial/Financial";
import db from "../../connection";
import { financialTable } from "../../Schema/FinancialSchema";
import { IRepository } from "../IRepository";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { schedulingTable } from "../../Schema/SchedulingSchema";
import { doctorTable } from "../../Schema/DoctorSchema";

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
            // ==== SELECT BASE ====
            const sqlChunks: SQL[] = [
            sql`SELECT`
            ];

            // ==== COLUNAS ====
            const sqlColumns: SQL[] = [
            sql`${financialTable.id} as id`,
            sql`${financialTable.date} as date`,
            sql`${financialTable.total} as total`,
            sql`${financialTable.totalDistributionClinic} as totalCLinic`,
            sql`${financialTable.totalDistributionDoctor} as totalDoctor`,
            sql`${financialTable.totalDistributionInsurance} as totalInsurance`
            ];

            // ==== JOINS (caso precise trazer o médico) ====
            const sqlJoins: SQL[] = [];

            if (financial?.scheduling?.doctor?.getUUIDHash()) {
            // Adiciona coluna agregada
            sqlColumns.push(sql`
                json_agg(
                json_build_object(
                    'id', ${doctorTable.id},
                    'name', ${doctorTable.name},
                    'crm', ${doctorTable.crm}
                )
                ) AS doctor
            `);

            sqlJoins.push(sql`
                INNER JOIN ${schedulingTable}
                ON ${financialTable.scheduling_id} = ${schedulingTable.id}
            `);

            sqlJoins.push(sql`
                INNER JOIN ${doctorTable}
                ON ${schedulingTable.doctor_id} = ${financial.scheduling.doctor.getUUIDHash()}
            `);
            }

            // ==== WHERE CONDITIONS ====
            const sqlConditions: SQL[] = [];

            if (financial?.getUUIDHash())  sqlConditions.push(sql`${financialTable.id} = ${financial.getUUIDHash()}`);
            if (financial?.date) sqlConditions.push(sql`${financialTable.date} = ${financial.date}`);
            if (financial?.scheduling?.getUUIDHash()) sqlConditions.push(sql`${financialTable.scheduling_id} = ${financial.scheduling.getUUIDHash()}`);

            // ==== AGRUPAMENTO ====
            const sqlGroupBy: SQL[] = [];
            if (financial?.scheduling?.doctor?.getUUIDHash()) sqlGroupBy.push(sql`GROUP BY ${financialTable.id}, ${doctorTable.id}`);

            // ==== MONTAGEM FINAL ====
            sqlChunks.push(sql.join(sqlColumns, sql`, `));
            sqlChunks.push(sql`FROM ${financialTable}`);

            if (sqlJoins.length > 0) sqlChunks.push(sql.join(sqlJoins, sql` `));
            if (sqlConditions.length > 0) sqlChunks.push(sql`WHERE ${sql.join(sqlConditions, sql` AND `)}`);
            if (sqlGroupBy.length > 0) sqlChunks.push(sql.join(sqlGroupBy, sql`, `));

            if(limit && offset) sqlChunks.push(sql`LIMIT ${limit} OFFSET ${offset}`);

            // ==== EXECUÇÃO ====
            const query = sql.join(sqlChunks, sql` `);
            const result = await db.execute(query);

            return result.rows;
        } catch (e) {
            return ResponseHandler.error((e as Error).message);
        }
    }        
}
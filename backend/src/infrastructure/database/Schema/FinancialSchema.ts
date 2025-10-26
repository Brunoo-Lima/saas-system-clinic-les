import {
  date,
  pgTable,
  uuid,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { schedulingTable } from "./SchedulingSchema";


//Movimentacoes 
export const financialTable = pgTable("financial", {
  id: uuid("fin_id").primaryKey(),
  total: real("fin_total_brute").default(0),
  date: date("fin_date").notNull(),
  totalDistributionDoctor: real("fin_total_distribution_doctor").notNull(),
  totalDistributionInsurance: real("fin_total_distribution_insurance").notNull(),
  totalDistributionClinic: real("fin_total_distribution_clinic").notNull(),
  scheduling_id: uuid("fk_fin_sch_id").references(() => schedulingTable.id),
  createdAt: timestamp("fin_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("fin_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})


// Relacionamentos de tabelas (One to One or One to Many)
/* 
  Paciente e Pagamentos
  Doutor e Pagamentos,
  Clinica e Pagamentos
*/
export const financialRelation = relations(financialTable, ({ one }) => ({
  scheduling: one(schedulingTable, {
    fields: [financialTable.scheduling_id],
    references: [schedulingTable.id]
  })
}))


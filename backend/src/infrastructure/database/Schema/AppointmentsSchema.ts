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
export const appointmentsTable = pgTable("appointment", {
  id: uuid("app_id").primaryKey(),
  total: real("app_total_brute").default(0),
  dateAppointment: date("app_dateAppointment").notNull(),
  totalDistributionDoctor: real("app_total_distribution_doctor").notNull(),
  totalDistributionInsurance: real("app_total_distribution_insurance").notNull(),
  totalDistributionClinic: real("app_total_distribution_clinic").notNull(),
  scheduling_id: uuid("fk_app_sch_id").references(() => schedulingTable.id),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})


// Relacionamentos de tabelas (One to One or One to Many)
/* 
  Paciente e Pagamentos
  Doutor e Pagamentos,
  Clinica e Pagamentos
*/
export const appointmentRelation = relations(appointmentsTable, ({ one }) => ({
  scheduling: one(schedulingTable, {
    fields: [appointmentsTable.scheduling_id],
    references: [schedulingTable.id]
  })
}))


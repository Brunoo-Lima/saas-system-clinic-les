import {
  pgTable,
  smallint,
  time,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { doctorTable } from "./DoctorSchema";
import { relations } from "drizzle-orm";

// Period
export const periodDoctorTable = pgTable("period", {
  id: uuid("per_id").primaryKey(),
  periodType: varchar("per_periodType", { length: 20 }).notNull(),
  dayWeek: smallint("per_dayWeek").notNull(),
  timeFrom: time("per_timeFrom").notNull(),
  timeTo: time("per_timeTo").notNull(),
  doctor_id: uuid("fk_per_doc_id").references(() => doctorTable.id)
})

// RELACIONAMENTOS
/* 
  Doutor e Periodo,
*/
export const periodRelation = relations(periodDoctorTable, ({ one }) => (
  {
    doctor: one(doctorTable, {
      fields: [periodDoctorTable.doctor_id],
      references: [doctorTable.id]
    })
  })
)
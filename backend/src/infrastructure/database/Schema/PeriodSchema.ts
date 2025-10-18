import {
  pgTable,
  smallint,
  time,
  timestamp,
  uuid
} from "drizzle-orm/pg-core";
import { doctorTable } from "./DoctorSchema";
import { relations } from "drizzle-orm";
import { specialtyTable } from "./SpecialtySchema";

// Period
export const periodDoctorTable = pgTable("period", {
  id: uuid("per_id").primaryKey(),
  dayWeek: smallint("per_dayWeek").notNull(),
  timeFrom: time("per_timeFrom").notNull(),
  timeTo: time("per_timeTo").notNull(),
  doctor_id: uuid("fk_per_doc_id").references(() => doctorTable.id),
  specialty_id: uuid("fk_per_spe_id").references(() => specialtyTable.id),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
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
    }),
    specialty: one(specialtyTable, {
      fields: [periodDoctorTable.specialty_id],
      references: [specialtyTable.id]
    })
  })
)
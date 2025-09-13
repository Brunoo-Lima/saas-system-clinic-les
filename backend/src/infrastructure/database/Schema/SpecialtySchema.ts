import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { insuranceToSpecialtyTable } from "./InsuranceSchema";




// Tabela de especialidades
export const specialtyTable = pgTable("specialty", {
  id: uuid("spe_id").primaryKey(),
  name: varchar("spe_name").notNull(),
});


// Relações inversas: Specialty
export const specialtyRelations = relations(specialtyTable, ({ many }) => ({
  insurances: many(insuranceToSpecialtyTable),
}));

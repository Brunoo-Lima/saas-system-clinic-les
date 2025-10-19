import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { insuranceToSpecialtyTable } from "./InsuranceSchema";




// Tabela de especialidades
export const specialtyTable = pgTable("specialty", {
  id: uuid("spe_id").primaryKey(),
  name: varchar("spe_name").notNull(),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});


// Relações inversas: Specialty
export const specialtyRelations = relations(specialtyTable, ({ many }) => ({
  insurances: many(insuranceToSpecialtyTable),
}));

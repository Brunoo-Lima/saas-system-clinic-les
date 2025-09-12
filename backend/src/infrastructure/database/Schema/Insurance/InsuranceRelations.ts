import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { insuranceTable } from "./InsuranceSchema";
import { specialtyTable } from "../Specialty/SpecialtySchema";

// Tabela de relacionamento intermediaria: Plano de saude e Especialidade
export const insuranceToSpecialtyTable = pgTable(
  "insurance_to_specialty",
  {
    price: real("isp_price").default(0).notNull(),
    insurance_id: uuid("insurance_id").references(() => insuranceTable.id),
    specialty_id: uuid("specialty_id").references(() => specialtyTable.id),
  },
  (t) => [
    {
      pk: primaryKey({
      columns: [t.insurance_id, t.specialty_id],
    }),
    }
  ]
);

// Relacionamentos de tabelas intermediarias (Many to Many)



// Relacionamento intermediario entre: Planos de saude e especialidades
export const insuranceToSpecialtyRelations = relations(
  insuranceToSpecialtyTable,
  ({ one }) => ({
    insurance: one(insuranceTable, {
      fields: [insuranceToSpecialtyTable.insurance_id],
      references: [insuranceTable.id],
    }),
    specialty: one(specialtyTable, {
      fields: [insuranceToSpecialtyTable.specialty_id],
      references: [specialtyTable.id],
    }),
  })
);

// Relações inversas: Insurance
export const insuranceRelations = relations(insuranceTable, ({ many }) => ({
  specialties: many(insuranceToSpecialtyTable),
}));

import {
  pgTable,
  uuid,
  primaryKey,
  real,
  varchar,
} from "drizzle-orm/pg-core";
import { specialtyTable } from "./SpecialtySchema";
import { relations } from "drizzle-orm";


// Tabela de planos de saúde
export const insuranceTable = pgTable("insurance", {
  id: uuid("ins_id").primaryKey(),
  type: varchar("ins_type").notNull(),
});



// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Plano de saude e Especialidade
export const insuranceToSpecialtyTable = pgTable(
  "insurance_to_specialty",
  {
    price: real("isp_price").default(0).notNull(),
    amountTransferred: real("isp_amount_transferred").default(0),
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

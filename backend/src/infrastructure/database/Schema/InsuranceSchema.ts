import {
  pgTable,
  uuid,
  primaryKey,
  real,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { specialtyTable } from "./SpecialtySchema";
import { relations } from "drizzle-orm";
import { modalityTable } from "./ModalitiesSchema";


// Tabela de planos de saúde
export const insuranceTable = pgTable("insurance", {
  id: uuid("ins_id").primaryKey(),
  name: varchar("ins_type").notNull(),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
});



// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Plano de saude e Especialidade
export const insuranceToSpecialtyTable = pgTable(
  "insurance_to_specialty",
  {
    price: real("isp_price").default(0).notNull(),
    amountTransferred: real("isp_amount_transferred").default(0),
    insurance_id: uuid("fk_isp_ins_id").references(() => insuranceTable.id),
    specialty_id: uuid("fk_isp_spe_id").references(() => specialtyTable.id),
  },
  (t) => [
    {
      pk: primaryKey({
        columns: [t.insurance_id, t.specialty_id],
      }),
    }
  ]
);


// Tabela de relacionamento entre convênios e modalidades
export const insuranceToModalitiesTable = pgTable("insurance_to_modalities", {
  insurance_id: uuid("fk_inm_ins_id").references(() => insuranceTable.id),
  modality_id: uuid("fk_inm_mod_id").references(() => modalityTable.id),
}, (t) => [
  {
    pk: primaryKey({
      columns: [t.insurance_id, t.modality_id]
    })
  }
])



// Relacionamento intermediario entre: Modalidades e plano de saúde
export const insuranceToModalitiesRelation = relations(
  insuranceToModalitiesTable,
  ({ one }) => ({
    insurance: one(insuranceTable, {
      fields: [insuranceToModalitiesTable.insurance_id],
      references: [insuranceTable.id],
    }),
    modality: one(modalityTable, {
      fields: [insuranceToModalitiesTable.modality_id],
      references: [modalityTable.id],
    }),
  })
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
  modalities: many(modalityTable)
}));

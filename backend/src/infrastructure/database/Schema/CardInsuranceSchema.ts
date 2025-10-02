import {
  pgTable,
  uuid,
  varchar,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { insuranceTable } from "./InsuranceSchema";
import { modalityTable } from "./ModalitiesSchema";
import { patientTable } from "./PatientSchema";


// Tabela de planos de saúde
export const cardInsuranceTable = pgTable("cardInsurance", {
  id: uuid("cti_id").primaryKey(),
  validate: date("cti_validate").notNull(),
  cardNumber: varchar("cti_card_number").notNull(),
  insurance_id: uuid("fk_cti_ins_id").references(() => insuranceTable.id),
  patient_id: uuid("fk_cti_pat_id").references(() => patientTable.id)
});

export const cardToModalityTable = pgTable("card_to_modality", {
  cardInsurance_id: uuid("fk_cmo_cti_id").references(() => cardInsuranceTable.id),
  modality_id: uuid("fk_cmo_mod_id").references(() => modalityTable.id)
}, (t) => [
  {
    pk: primaryKey({
      columns: [t.cardInsurance_id, t.modality_id],
    }),
  }
])


export const cardToModalityRelation = relations(cardToModalityTable, ({ one }) => ({
  cardInsurance: one(cardInsuranceTable, {
    fields: [cardToModalityTable.cardInsurance_id],
    references: [cardInsuranceTable.id]
  }),
  modality: one(modalityTable, {
    fields: [cardToModalityTable.modality_id],
    references: [modalityTable.id]
  })
}))


export const cardInsuranceRelation = relations(cardInsuranceTable, ({ one }) => ({
  patient: one(patientTable, {
    fields: [cardInsuranceTable.patient_id],
    references: [patientTable.id]
  }),
  insurance: one(insuranceTable, {
    fields: [cardInsuranceTable.insurance_id],
    references: [insuranceTable.id]
  })
}))
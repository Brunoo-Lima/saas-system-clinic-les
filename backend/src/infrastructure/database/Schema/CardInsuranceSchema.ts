import {
  pgTable,
  uuid,
  varchar,
  date,
  primaryKey,
  timestamp,
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
  patient_id: uuid("fk_cti_pat_id").references(() => patientTable.id),
  modality_id: uuid("fk_cti_mod_id").references(() => modalityTable.id),
  createdAt: timestamp("use_createdAt")
  .$defaultFn(() => new Date())
  .notNull(),
  updatedAt: timestamp("use_updatedAt")
  .$defaultFn(() => new Date())
  .notNull()
});


export const cardInsuranceRelation = relations(cardInsuranceTable, ({ one }) => ({
  patient: one(patientTable, {
    fields: [cardInsuranceTable.patient_id],
    references: [patientTable.id]
  }),
  modality: one(modalityTable, {
    fields: [cardInsuranceTable.modality_id],
    references: [modalityTable.id]
  }),
  insurance: one(insuranceTable, {
    fields: [cardInsuranceTable.insurance_id],
    references: [insuranceTable.id]
  })
}))
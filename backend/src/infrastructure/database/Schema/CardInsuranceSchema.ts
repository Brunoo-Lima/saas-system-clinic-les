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


// Tabela de planos de saúde
export const cardInsuranceTable = pgTable("cardInsurance", {
  id: uuid("cti_id").primaryKey(),
  validate: date("cti_validate").notNull(),
  cartNumber: varchar("cti_cart_number").notNull(),
  insurance_id: uuid("fk_cti_ins_id").references(() => insuranceTable.id)
});

export const cartToModalityTable = pgTable("card_to_modality", {
  cartInsurance_id: uuid("fk_cmo_cti_id").references(() => cardInsuranceTable.id),
  modality_id: uuid("fk_cmo_mod_id").references(() => modalityTable.id)
}, (t) => [
  {
    pk: primaryKey({
      columns: [t.cartInsurance_id, t.modality_id],
    }),
  }
])


export const cartToModalityRelation = relations(cartToModalityTable, ({ one }) => ({
  cartInsurance: one(cardInsuranceTable, {
    fields: [cartToModalityTable.cartInsurance_id],
    references: [cardInsuranceTable.id]
  }),
  modality: one(modalityTable, {
    fields: [cartToModalityTable.modality_id],
    references: [modalityTable.id]
  })
}))


export const cartInsuranceRelation = relations(cardInsuranceTable, ({ one }) => ({
  insurance: one(insuranceTable, {
    fields: [cardInsuranceTable.insurance_id],
    references: [insuranceTable.id]
  })
}))
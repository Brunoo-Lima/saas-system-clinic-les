import {
  pgTable,
  uuid,
  primaryKey,
  real,
  varchar,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { insuranceTable } from "./InsuranceSchema";


// Tabela de planos de saúde
export const cartInsuranceTable = pgTable("cartInsurance", {
  id: uuid("cti_id").primaryKey(),
  validate: date("cti_validate").notNull(),
  cartNumber: varchar("cti_cart_number").notNull(),
  insurance_id: uuid("fk_cti_ins_id").references(() => insuranceTable.id)
});

export const cartInsuranceRelation = relations(cartInsuranceTable, ({one}) => ({
    insurance: one(insuranceTable, {
        fields: [cartInsuranceTable.insurance_id],
        references: [insuranceTable.id]
    })
}))
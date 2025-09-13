import {
  pgTable,
  uuid,
  varchar,
  real,
  time,
  primaryKey,
} from "drizzle-orm/pg-core";
import { addressTable } from "./AddressSchema";
import { insuranceTable } from "./InsuranceSchema";
import { doctorTable } from "./DoctorSchema";
import { relations } from "drizzle-orm/relations";

// Clinica
export const clinicTable = pgTable("clinic", {
  id: uuid("cli_id").primaryKey(),
  name: varchar("cli_name").notNull().unique(),
  priceOfConsult: real("cli_price_of_consult").default(0).notNull(),
  timeToConfirmScheduling: time("cli_time_to_confirm_scheduling").notNull(),
  contact: varchar("cli_contact").notNull(),
  address_id: uuid("fk_cli_add_id").references(() => addressTable.id)
})


// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Clinica e Plano de saude
export const clinicToInsuranceTable = pgTable(
  "clinic_to_insurance",
  {
    price: real("cin_price").default(0).notNull(), // Preço a clinica cobra por especilidade
    clinic_id: uuid("fk_cin_cli_id").references(() => clinicTable.id),
    insurance_id: uuid("fk_cin_ins_id").references(() => insuranceTable.id)
  },
  (t) => [
    {
      pk: primaryKey({
        columns: [t.clinic_id, t.insurance_id]
      })
    }
  ]
)

// Relacionamento intermediario entre: Clinica e Plano de saude
export const clinicToInsuranceRelation = relations(clinicToInsuranceTable, ({ one }) => ({
  clinic: one(clinicTable, {
    fields: [clinicToInsuranceTable.clinic_id],
    references: [clinicTable.id]
  }),
  insurance: one(insuranceTable, {
    fields: [clinicToInsuranceTable.insurance_id],
    references: [insuranceTable.id]
  })
}))


// Clinica Relations
export const clinicRelations = relations(clinicTable, ({ one, many }) => ({
  doctor: many(doctorTable),
  address: one(addressTable, {
    fields: [clinicTable.address_id],
    references: [addressTable.id]
  })
}))

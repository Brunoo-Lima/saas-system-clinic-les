
import { clinicTable } from "./ClinicSchema";
import { insuranceTable } from "../Insurance/InsuranceSchema";
import { doctorTable } from "../Doctor/DoctorSchema";
import { addressTable } from "../Address/AddressSchema";
import {
  pgTable,
  uuid,
  primaryKey,
  real
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

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
    pk:  primaryKey({
      columns: [t.clinic_id, t.insurance_id]
    })
   }
  ]
)

// Relacionamento intermediario entre: Clinica e Plano de saude
export const clinicToInsuranceRelation = relations(clinicToInsuranceTable, ({one}) => ({
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
export const clinicRelations = relations(clinicTable, ({one, many}) => ({
  doctor: many(doctorTable),
  address: one(addressTable, {
    fields: [clinicTable.address_id],
    references: [addressTable.id]
  })
}))

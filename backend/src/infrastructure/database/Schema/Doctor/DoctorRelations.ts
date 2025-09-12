import { relations } from "drizzle-orm";
import {
  pgTable,
  primaryKey,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { doctorTable } from "./DoctorSchema";
import { specialtyTable } from "../Specialty/SpecialtySchema";
import { periodDoctorTable } from "../Period/PeriodSchema";
import { addressTable } from "../Address/AddressSchema";
import { clinicTable } from "../Clinic/ClinicSchema";


// Tabela de relacionamento intermediaria: Doutor e Especialidades
export const doctorToSpecialtyTable = pgTable(
  "doctor_to_specialty", 
  {
    percent_distribution: real("dsp_percent_distribution").default(0).notNull(),
    doctor_id: uuid("fk_dsp_doc_id").references(() => doctorTable.id),
    specialty_id: uuid("specialty_id").references(() => specialtyTable.id)
  }, 
  (t) => [
  {
    pk:  primaryKey({
      columns: [t.doctor_id, t.specialty_id]
    })
  }
])

// Relacionamento intermediario entre: Doutor e Especialidade
export const doctorToSpecialtyRelation = relations(doctorToSpecialtyTable, ({one}) => ({
  doctor: one(doctorTable, {
    fields: [doctorToSpecialtyTable.doctor_id],
    references: [doctorTable.id]
  }),
  specialty: one(specialtyTable, {
    fields: [doctorToSpecialtyTable.specialty_id],
    references: [specialtyTable.id]
  })
}))


/* 
  Doutor e Clinica
  Doutor e Periodos,
*/
export const doctorRelation = relations(doctorTable, ({one, many}) => ({
    periods: many(periodDoctorTable),
    address: one(addressTable, {
      fields: [doctorTable.address_id],
      references: [addressTable.id]
    }),
    clinic: one(clinicTable, {
      fields: [doctorTable.clinic_id],
      references: [clinicTable.id]
    })
  })
)





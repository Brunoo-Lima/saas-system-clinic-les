import {
  pgTable,
  uuid,
  primaryKey,
  real,
  varchar,
} from "drizzle-orm/pg-core";
import { addressTable } from "./AddressSchema";
import { userTable } from "./UserSchema";
import { clinicTable } from "./ClinicSchema";
import { specialtyTable } from "./SpecialtySchema";
import { periodDoctorTable } from "./PeriodSchema";
import { relations } from "drizzle-orm";
// Doctors
export const doctorTable = pgTable("doctor", {
  id: uuid("dct_id").primaryKey(),
  crm: varchar("dct_crm").notNull().unique(),
  cpf: varchar("dct_cpf").notNull(),
  sex: varchar("dct_sex").notNull(),
  date_of_birth: varchar("dct_date_of_birth"),
  phone: varchar("dct_phone").notNull(),
  user_id: uuid("fk_dct_use_id").references(() => userTable.id),
  clinic_id: uuid("fk_dct_cli_id").references(() => clinicTable.id),
  address_id: uuid("fk_dct_add_id").references(() => addressTable.id)
})


// RELACIONAMENTOS
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
      pk: primaryKey({
        columns: [t.doctor_id, t.specialty_id]
      })
    }
  ])

// Relacionamento intermediario entre: Doutor e Especialidade
export const doctorToSpecialtyRelation = relations(doctorToSpecialtyTable, ({ one }) => ({
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
export const doctorRelation = relations(doctorTable, ({ one, many }) => ({
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





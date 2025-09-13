import { userTable } from './UserSchema'
import { addressTable } from './AddressSchema'
import {
  pgTable,
  uuid,
  varchar,
  primaryKey,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { insuranceTable } from './InsuranceSchema';

// Pacientes
export const patientTable = pgTable("patient", {
  id: uuid("pat_id").primaryKey(),
  name: varchar("pat_name").notNull(),
  dateOfBirth: date("pat_dateOfBirth").notNull(),
  contact1: varchar("pat_contact1").notNull(),
  cpf: varchar("pat_cpf").notNull().unique(),
  user_id: uuid("fk_pat_use_id").references(() => userTable.id),
  address_id: uuid("fk_pat_add_id").references(() => addressTable.id)
})



// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Paciente e Plano de saude
export const patientToInsuranceTable = pgTable(
  "patient_to_insurance",
  {
    patient_id: uuid("fk_pin_pat_id").references(() => patientTable.id),
    insurance_id: uuid("fk_pin_ins_id").references(() => insuranceTable.id)
  },
  (t) => [
    {
      pk: primaryKey({ // Chave primaria composta
        columns: [t.patient_id, t.insurance_id]
      })
    }
  ]
)

//Relacionamento da tabela de relacionamento 
export const patientToInsuranceRelations = relations(
  patientToInsuranceTable,
  ({ one }) => ({
    patient: one(patientTable, {
      fields: [patientToInsuranceTable.patient_id],
      references: [patientTable.id]
    }),
    insurance: one(insuranceTable, {
      fields: [patientToInsuranceTable.insurance_id],
      references: [insuranceTable.id]
    })
  })
)

/* 
  Paciente e Usuário 
  Paciente e endereco
*/
export const patientRelations = relations(patientTable, ({ one, many }) => ({
  user: one(userTable,
    {
      fields: [patientTable.user_id],
      references: [userTable.id]
    }
  ),
  address: one(addressTable, {
    fields: [patientTable.address_id],
    references: [addressTable.id]
  })
}))

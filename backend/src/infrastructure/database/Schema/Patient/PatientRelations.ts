import {patientTable} from './PatientSchema';
import { relations } from "drizzle-orm";
import {insuranceTable} from '../Insurance/InsuranceSchema';
import { userTable } from '../User/UserSchema';
import { addressTable } from '../Address/AddressSchema';
import {
  pgTable,
  primaryKey,
  uuid,
} from "drizzle-orm/pg-core";



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
  ({one}) => ({
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
export const patientRelations = relations(patientTable, ({one, many}) => ({
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

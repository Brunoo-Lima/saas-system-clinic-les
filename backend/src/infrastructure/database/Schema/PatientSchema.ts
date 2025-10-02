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
import { cardInsuranceTable } from './CardInsuranceSchema';

// Pacientes
export const patientTable = pgTable("patient", {
  id: uuid("pat_id").primaryKey(),
  name: varchar("pat_name").notNull(),
  dateOfBirth: date("pat_dateOfBirth").notNull(),
  phone: varchar("pat_phone").notNull(),
  sex: varchar("pat_sex").notNull(),
  cpf: varchar("pat_cpf").notNull().unique(),
  user_id: uuid("fk_pat_use_id").references(() => userTable.id),
  address_id: uuid("fk_pat_add_id").references(() => addressTable.id)
})



// RELACIONAMENTOS
// Tabela de relacionamento intermediaria: Paciente e Plano de saude
export const patientToCartInsuranceTable = pgTable(
  "patient_to_card_insurance",
  {
    patient_id: uuid("fk_pti_pat_id").references(() => patientTable.id),
    cart_insurance_id: uuid("fk_pti_cti_id").references(() => cardInsuranceTable.id)
  },
  (t) => [
    {
      pk: primaryKey({ // Chave primaria composta
        columns: [t.patient_id, t.cart_insurance_id]
      })
    }
  ]
)

//Relacionamento da tabela de relacionamento 
export const patientToCartInsuranceRelations = relations(
  patientToCartInsuranceTable,
  ({ one }) => ({
    patient: one(patientTable, {
      fields: [patientToCartInsuranceTable.patient_id],
      references: [patientTable.id]
    }),
    insurance: one(cardInsuranceTable, {
      fields: [patientToCartInsuranceTable.cart_insurance_id],
      references: [cardInsuranceTable.id]
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

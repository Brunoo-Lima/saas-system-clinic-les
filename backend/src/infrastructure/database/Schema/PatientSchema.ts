import { userTable } from './UserSchema'
import { addressTable } from './AddressSchema'
import {
  pgTable,
  uuid,
  varchar,
  primaryKey,
  date,
  timestamp,
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
  address_id: uuid("fk_pat_add_id").references(() => addressTable.id),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
})

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

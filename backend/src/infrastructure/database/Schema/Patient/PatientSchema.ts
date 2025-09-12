import {userTable} from '../User/UserSchema'
import {addressTable} from '../Address/AddressSchema'
import {
  pgTable,
  uuid,
  varchar,
  date,
} from "drizzle-orm/pg-core";


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

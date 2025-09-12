import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { addressTable } from "../Address/AddressSchema";
import { userTable } from "../User/UserSchema";
import { clinicTable } from "../Clinic/ClinicSchema";


// Doctors
export const doctorTable = pgTable("doctor", {
  id: uuid("dct_id").primaryKey(),
  crm: varchar("dct_crm").notNull().unique(),
  cpf: varchar("dct_cpf").notNull(),
  contact: varchar("dct_contact").notNull(),
  user_id: uuid("fk_dct_use_id").references(() => userTable.id),
  clinic_id: uuid("fk_dct_cli_id").references(() => clinicTable.id),
  address_id: uuid("fk_dct_add_id").references(() => addressTable.id)
})
import {
  pgTable,
  uuid,
  varchar,
  real,
  time,
} from "drizzle-orm/pg-core";
import { addressTable } from "../Address/AddressSchema";


// Clinica
export const clinicTable = pgTable("clinic", {
  id: uuid("cli_id").primaryKey(),
  name: varchar("cli_name").notNull().unique(),
  priceOfConsult: real("cli_price_of_consult").default(0).notNull(),
  timeToConfirmScheduling: time("cli_time_to_confirm_scheduling").notNull(),
  contact: varchar("cli_contact").notNull(),
  address_id: uuid("fk_cli_add_id").references(() => addressTable.id)
})

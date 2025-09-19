import {
  pgTable,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
// Pacientes
export const modalityTable = pgTable("modality", {
  id: uuid("mod_id").primaryKey(),
  name: varchar("mod_name").notNull()
})

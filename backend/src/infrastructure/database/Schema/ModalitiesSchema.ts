import {
  pgTable,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";
// Pacientes
export const modalityTable = pgTable("modality", {
  id: uuid("mod_id").primaryKey(),
  name: varchar("mod_name").notNull(),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})

import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";


export const addressTable = pgTable("address", {
  id: uuid("add_id").primaryKey(),
  name: varchar("add_name").notNull().unique(),
  number: varchar("add_number").notNull(),
  neighborhood: varchar("add_neighborhood").notNull(),
  street: varchar("add_street").notNull(),
  cep: varchar("add_cep").notNull(),
  country: varchar("add_country").notNull(),
  state: varchar("add_state").notNull(),
  uf: varchar("add_uf").notNull(),
  city: varchar("add_city").notNull(),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})
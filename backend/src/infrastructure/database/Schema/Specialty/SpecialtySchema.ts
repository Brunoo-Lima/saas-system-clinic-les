import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";



// Tabela de especialidades
export const specialtyTable = pgTable("specialty", {
  id: uuid("spe_id").primaryKey(),
  name: varchar("spe_name").notNull(),
});

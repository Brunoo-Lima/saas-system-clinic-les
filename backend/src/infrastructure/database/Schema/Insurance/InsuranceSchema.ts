import {
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";



// Tabela de planos de saúde
export const insuranceTable = pgTable("insurance", {
  id: uuid("ins_id").primaryKey(),
  type: varchar("ins_type").notNull(),
});

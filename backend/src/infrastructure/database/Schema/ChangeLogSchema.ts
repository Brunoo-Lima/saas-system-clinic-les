import {
  pgTable,
  smallint,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userTable } from "./UserSchema";

// Period
export const changeLog = pgTable("changelog", {
  id: uuid("chg_id").primaryKey(),
  table_name: varchar("chg_table_name").notNull(),
  rowID: smallint("chg_row_id").notNull(),
  action: time("chg_action").notNull(),
  description: time("chg_description").notNull(),
  user_id: uuid("fk_chg_use_id").references(() => userTable.id),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
})

// RELACIONAMENTOS
/* 
  Doutor e Periodo,
*/
export const periodRelation = relations(changeLog, ({ one }) => (
  {
    doctor: one(userTable, {
      fields: [changeLog.user_id],
      references: [userTable.id]
    })
  })
)
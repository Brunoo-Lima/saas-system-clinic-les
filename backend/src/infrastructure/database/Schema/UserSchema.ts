import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("users", {
  id: uuid("use_id").primaryKey(),
  email: varchar("use_email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("use_emailVerified").notNull().default(false),
  password: varchar("use_password", { length: 255 }).notNull(),
  role: varchar("use_role", { length: 50 }).notNull().default("admin"),
  avatar: text("use_avatar"),
  status: boolean("use_status").default(true),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

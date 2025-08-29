import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

import { randomUUID } from "crypto";
import { pgTable, varchar } from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
    id: varchar("id").default(randomUUID()).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVellicated: varchar("emailVellicated", { length: 5 }).notNull().default("false"),
    password: varchar("password", { length: 255 }).notNull(),
    passwordConfirmed: varchar("passwordConfirmed", { length: 255 }).notNull(),
    role: varchar("role", { length: 50 }).notNull().default("user"),
    avatar: varchar("avatar", { length: 255 }),
});
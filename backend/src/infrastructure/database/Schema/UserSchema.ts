import { relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";
import { patientTable } from "./PatientSchema";
import { doctorTable } from "./DoctorSchema";
import { clinicTable } from "./ClinicSchema";

export const userTable = pgTable("users", {
  id: uuid("use_id").primaryKey(),
  email: varchar("use_email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("use_emailVerified").notNull().default(false),
  profileCompleted: boolean("use_profile_completed").notNull().default(false),
  username: varchar("use_username"),
  password: varchar("use_password", { length: 255 }).notNull(),
  role: varchar("use_role", { length: 50 }).notNull(),
  avatar: text("use_avatar"),
  status: boolean("use_status").default(true),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => (
  {
    patients: many(patientTable),
    doctors: many(doctorTable),
    clinic: many(clinicTable)
  })
)
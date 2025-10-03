import {
  pgTable,
  uuid,
  boolean,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { doctorTable } from "./DoctorSchema";
import { relations } from "drizzle-orm";

export const doctorSchedulingTable  = pgTable("doctorScheduling",{
    id: uuid("dsh_id").primaryKey(),
    dateFrom: date("dsh_dateFrom").notNull(),
    dateTo: date("dsh_dateTo").notNull(),
    isActivate: boolean("dsh_is_activate").default(false),
    doctor_id: uuid("fk_dsh_dct_id").references(() => doctorTable.id),
    createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
    updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})

export const doctorSchedulingRelation = relations(doctorSchedulingTable, ({one}) => ({
    doctor: one(
        doctorTable,
        {
            fields: [doctorSchedulingTable.doctor_id],
            references: [doctorTable.id]
        }
    )
}))
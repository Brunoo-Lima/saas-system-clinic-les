import {
  pgTable,
  uuid,
  date,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { doctorSchedulingTable } from "./DoctorScheduling";

export const schedulingBlockedDays  = pgTable("schedulingBlockedDays",{
    id: uuid("sbl_id").primaryKey(),
    dateBlocked: date("dsh_date_blocked").notNull(),
    reason: varchar("dsh_reason").notNull(),
    doctorScheduling_id: uuid("fk_sbl_dsh_id").references(() => doctorSchedulingTable.id),
    createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
    updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull()
})

export const schedulingBlockedRelation = relations(schedulingBlockedDays, ({one}) => ({
    schedulingDoctor: one(
        doctorSchedulingTable,
        {
            fields: [schedulingBlockedDays.doctorScheduling_id],
            references: [doctorSchedulingTable.id]
        }
    )
}))
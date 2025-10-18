import {
  date,
  pgTable,
  uuid,
  varchar,
  boolean,
  real,
  timestamp,
  time
} from "drizzle-orm/pg-core";
import { doctorTable } from "./DoctorSchema";
import { patientTable } from "./PatientSchema";
import { insuranceTable } from "./InsuranceSchema";
import { specialtyTable } from "./SpecialtySchema";


//Agendamentos
export const schedulingTable = pgTable("scheduling", {
  id: uuid("sch_id").primaryKey(),
  date: timestamp("sch_date").notNull(),
  status: varchar("sch_status").notNull(),
  isReturn: boolean("sch_is_return").notNull(),
  priceOfConsultation: real("sch_price_of_consultation").default(0),
  dateOfConfirmation: date("sch_date_of_confirmation").notNull(),
  timeOfConsultation: time('sch_time_consultation'),
  doctor_id: uuid("fk_sch_doc_id").references(() => doctorTable.id),
  patient_id: uuid("fk_sch_pat_id").references(() => patientTable.id),
  insurance_id: uuid("fk_sch_ins_id").references(() => insuranceTable.id),
  specialty_id: uuid("fk_sch_spe_id").references(() => specialtyTable.id),
  createdAt: timestamp("use_createdAt")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("use_updatedAt")
    .$defaultFn(() => new Date())
    .notNull(),
})

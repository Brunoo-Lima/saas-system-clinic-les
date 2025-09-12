import {
  date,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { doctorTable } from "../Doctor/DoctorSchema";
import { patientTable } from "../Patient/PatientSchema";
import { insuranceTable } from "../Insurance/InsuranceSchema";
import { specialtyTable } from "../Specialty/SpecialtySchema";


//Agendamentos
export const schedulingTable = pgTable("scheduling", {
  id: uuid("sch_id").primaryKey(),
  date: date("sch_date").notNull(),
  status: varchar("sch_status").notNull(),
  doctor_id: uuid("fk_sch_doc_id").references(() => doctorTable.id),
  patient_id: uuid("fk_sch_pat_id").references(() => patientTable.id),
  insurance_id: uuid("fk_sch_ins_id").references(() => insuranceTable.id),
  specialty_id: uuid("fk_sch_spe_id").references(() => specialtyTable.id),
})

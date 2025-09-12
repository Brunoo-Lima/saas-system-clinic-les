import {
  date,
  pgTable,
  uuid,
  real,
} from "drizzle-orm/pg-core";
import { patientTable } from "../Patient/PatientSchema";
import { doctorTable } from "../Doctor/DoctorSchema";
import { clinicTable } from "../Clinic/ClinicSchema";


//Movimentacoes 
export const appointmentsTable = pgTable("appointment", {
  id: uuid("app_id").primaryKey(),
  total: real("app_total").default(0),
  dateAppointment: date("app_dateAppointment").notNull(),
  totalDistributionDoctor: real("app_total_distribution_doctor").notNull(),
  totalDistributionInsurance: real("app_total_distribution_insurance").notNull(),
  totalDistributionClinic: real("app_total_distribution_clinic").notNull(),
  patient_id: uuid("patient_id").references(() => patientTable.id),
  doctor_id: uuid("doctor_id").references(() => doctorTable.id),
  clinic_id: uuid("clinic_id").references(() => clinicTable.id)
})


import {
  date,
  pgTable,
  uuid,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { patientTable } from "./PatientSchema";
import { doctorTable } from "./DoctorSchema";
import { clinicTable } from "./ClinicSchema";


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


// Relacionamentos de tabelas (One to One or One to Many)
/* 
  Paciente e Pagamentos
  Doutor e Pagamentos,
  Clinica e Pagamentos
*/
export const appointmentRelation = relations(appointmentsTable, ({ one }) => ({
  patient: one(patientTable, {
    fields: [appointmentsTable.patient_id],
    references: [patientTable.id]
  }),
  doctor: one(doctorTable, {
    fields: [appointmentsTable.doctor_id],
    references: [doctorTable.id]
  }),
  clinic: one(clinicTable, {
    fields: [appointmentsTable.clinic_id],
    references: [clinicTable.id]
  })
}))


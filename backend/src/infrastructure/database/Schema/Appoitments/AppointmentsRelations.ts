import { relations } from "drizzle-orm";
import { patientTable } from "../Patient/PatientSchema";
import { appointmentsTable } from "./AppointmentsSchema";
import { doctorTable } from "../Doctor/DoctorSchema";
import { clinicTable } from "../Clinic/ClinicSchema";



// Relacionamentos de tabelas (One to One or One to Many)

/* 
  Paciente e Pagamentos
  Doutor e Pagamentos,
  Clinica e Pagamentos
*/
export const appointmentRelation = relations(appointmentsTable, ({one}) => ({
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


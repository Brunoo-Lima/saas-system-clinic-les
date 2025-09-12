import { relations } from "drizzle-orm";
import { periodDoctorTable } from "./PeriodSchema";
import { doctorTable } from "../Doctor/DoctorSchema";

/* 
  Doutor e Periodo,
*/
export const periodRelation = relations(periodDoctorTable, ({one}) => (
  {
    doctor: one(doctorTable, {
      fields: [periodDoctorTable.doctor_id],
      references: [doctorTable.id]
    })
  })
)
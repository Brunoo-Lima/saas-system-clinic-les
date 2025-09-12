import { relations } from "drizzle-orm";
import { specialtyTable } from "./SpecialtySchema";
import { insuranceToSpecialtyTable } from "../Insurance/InsuranceRelations";


// Relações inversas: Specialty
export const specialtyRelations = relations(specialtyTable, ({ many }) => ({
  insurances: many(insuranceToSpecialtyTable),
}));

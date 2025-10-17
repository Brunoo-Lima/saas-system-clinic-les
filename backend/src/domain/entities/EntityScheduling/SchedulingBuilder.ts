import { Doctor } from "../EntityDoctor/Doctor";
import { Insurance } from "../EntityInsurance/Insurance";
import { Patient } from "../EntityPatient/Patient";
import { Specialty } from "../EntitySpecialty/Specialty";
import { Scheduling } from "./Scheduling";
import { IScheduling } from "./types/IScheduling";

export class SchedulingBuilder {
  private data: Partial<IScheduling> = {};

  setDate(date?: Date | undefined): this {
    this.data.date = date;
    return this;
  }

  setDateOfConfirmation(dateOfConfirmation?: Date | undefined): this {
    this.data.dateOfConfirmation = dateOfConfirmation;
    return this;
  }

  setTimeOfConsultation(time?: number | undefined): this {
    this.data.timeOfConsultation = time
    return this
  }

  setDoctor(doctor?: Doctor | undefined): this {
    this.data.doctor = doctor
    return this
  }
  setInsurance(insurance?: Insurance | undefined) {
    this.data.insurance = insurance
    return this
  }
  setIsReturn(isReturn?: boolean | undefined) {
    this.data.isReturn = isReturn
    return this
  }
  setPatient(patient?: Patient | undefined) {
    this.data.patient = patient
    return this
  }
  setPriceOfConsultation(priceOfConsultation?: number | undefined) {
    this.data.priceOfConsultation = priceOfConsultation
    return this
  }
  setSpecialty(specialty?: Specialty | undefined) {
    this.data.specialty = specialty
    return this
  }
  setStatus(status?: "CONFIRMED" | "PENDING" | "CONCLUDE" | "CANCELED" | undefined) {
    this.data.status = status
    return this
  }
  build(): Scheduling {
    return new Scheduling({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IScheduling> {
    return { ...this.data };
  }
}

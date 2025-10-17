import { Doctor } from "../../EntityDoctor/Doctor"
import { Insurance } from "../../EntityInsurance/Insurance"
import { Patient } from "../../EntityPatient/Patient"
import { Specialty } from "../../EntitySpecialty/Specialty"

export interface IScheduling {
    date?: Date | undefined
    timeOfConsultation?: number | undefined
    doctor?: Doctor | undefined
    patient?: Patient | undefined
    priceOfConsultation?: number | undefined;
    isReturn?: boolean | undefined
    insurance?: Insurance | undefined
    specialty?: Specialty | undefined
    status?: "CONFIRMED" | "PENDING" | "CONCLUDE" | "CANCELED" | undefined,
    dateOfConfirmation?: Date | undefined
}
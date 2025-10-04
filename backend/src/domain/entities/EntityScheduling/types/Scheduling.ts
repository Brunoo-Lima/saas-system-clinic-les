import { Doctor } from "../../EntityDoctor/Doctor"
import { Insurance } from "../../EntityInsurance/Insurance"
import { Patient } from "../../EntityPatient/Patient"
import { Specialty } from "../../EntitySpecialty/Specialty"

export interface IScheduling {
    date: Date
    doctor: Doctor
    patient: Patient
    priceOfConsultation: number;
    isReturn: boolean
    insurance: Insurance
    specialty: Specialty
    status: "Pending" | "Realizable" | "Canceled",
    dateOfConfirmation: Date
}
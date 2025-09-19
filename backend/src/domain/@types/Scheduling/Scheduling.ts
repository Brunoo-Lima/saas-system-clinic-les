import { Doctor } from "../../entities/EntityDoctor/Doctor"
import { Insurance } from "../../entities/EntityInsurance/Insurance"
import { Patient } from "../../entities/EntityPatient/Patient"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"

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
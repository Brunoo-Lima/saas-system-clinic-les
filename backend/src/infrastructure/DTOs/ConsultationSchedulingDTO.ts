import { DoctorDTO } from "./DoctorDTO"
import { InsuranceDTO } from "./InsuranceDTO"
import { PatientDTO } from "./PatientDTO"

export interface ConsultationSchedulingDTO {
    date?: string
    priceOfConsultation: number
    isReturn: boolean
    status: "CONFIRMED" | "PENDING" | "CONCLUDE" | "CANCELED",
    dateOfConfirmation: string
    doctor: DoctorDTO
    patient: PatientDTO
    insurance: InsuranceDTO,
    specialty: {
        id: string,
        name: string
    }
}
import { DoctorDTO } from "./DoctorDTO"
import { InsuranceDTO } from "./InsuranceDTO"
import { PatientDTO } from "./PatientDTO"

export interface ConsultationSchedulingDTO { 
    id?: string
    date?: string
    hour: string
    dateOfRealizable: string;
    priceOfConsultation: number
    isReturn: boolean
    status: "CONFIRMED" | "PENDING" | "CONCLUDE" | "CANCELED" | "CONFIRMATION_PENDING" | "CANCEL_PENDING",
    dateOfConfirmation: string
    doctor: DoctorDTO
    patient: PatientDTO
    insurance: InsuranceDTO,
    specialty: {
        id: string,
        name: string
    }
}
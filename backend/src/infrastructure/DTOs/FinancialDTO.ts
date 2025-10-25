import { ConsultationSchedulingDTO } from "./ConsultationSchedulingDTO"

export interface FinancialDTO {
    id?: string
    date: string
    total: number
    totalDoctor: number
    totalClinic: number
    totalInsurance: number
    scheduling: ConsultationSchedulingDTO
}
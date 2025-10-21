import { DoctorDTO } from "./DoctorDTO"
import { PeriodDTO } from "./PeriodDTO"

export interface SchedulingDoctorDTO {
    id: string,
    doctor: DoctorDTO,
    dateFrom: string,
    dateTo: string,
    isActivate: boolean,
    periodToWork?: Array<PeriodDTO>,
    datesBlocked: Array<{
        id?: string,
        date: string,
        reason: string
    }>
}
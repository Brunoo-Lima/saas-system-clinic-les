import { DoctorDTO } from "./DoctorDTO"

export interface SchedulingDoctorDTO {
    id: string,
    doctor: DoctorDTO,
    dateFrom: string,
    dateTo: string,
    isActivate: boolean,
    datesBlocked: Array<{
        date: string,
        reason: string
    }>
}
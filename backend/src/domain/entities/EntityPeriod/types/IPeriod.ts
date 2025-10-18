import { Specialty } from "../../EntitySpecialty/Specialty"

export interface IPeriod {
    dayWeek: number
    timeFrom: string
    timeTo: string,
    specialty: Specialty
}
import { Specialty } from "../../EntitySpecialty/Specialty"

export interface IPeriod {
    dayWeek: number | undefined
    timeFrom: string | undefined
    timeTo: string | undefined
    specialty: Specialty
}
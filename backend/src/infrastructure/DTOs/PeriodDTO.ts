export interface PeriodDTO {
    id?: string,
    periodType?:  "morning" | "afternoon" | "night" | undefined
    dayWeek?: number
    timeFrom?: string
    timeTo?: string,
    specialty_id?: string
}
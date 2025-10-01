export interface IPeriod {
    periodType: "morning" | "afternoon" | "night" | "default"
    dayWeek: number
    timeFrom: string
    timeTo: string
}
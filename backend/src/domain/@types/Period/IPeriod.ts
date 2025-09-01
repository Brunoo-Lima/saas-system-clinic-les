export interface IPeriod {
    periodType: "morning" | "afternoon" | "night"
    dayWeek: number
    timeFrom: number
    timeTo: number
}
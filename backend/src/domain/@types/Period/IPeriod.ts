export interface IPeriod {
    periodType: "morning" | "afternoon" | "night"
    date: Date
    timeFrom: number
    timeTo: number
}
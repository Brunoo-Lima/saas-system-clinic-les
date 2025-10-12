import { Doctor } from "../../EntityDoctor/Doctor"
import { SchedulingBlockedDays } from "../../EntitySchedulingBlockedDays/SchedulingBlockedDays"

export interface IDoctorScheduling {
    id?: string | undefined,
    dayFrom?: Date | undefined,
    dayTo?: Date | undefined
    is_activate?: boolean | undefined
    doctor?: Doctor | undefined
    datesBlocked?: SchedulingBlockedDays[] | undefined
}
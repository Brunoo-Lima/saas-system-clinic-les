import { Scheduling } from "../../EntityScheduling/Scheduling";

export interface IFinancial{
    total?: number | undefined,
    date?: Date | undefined,
    totalInsurance?: number | undefined,
    totalDoctor?: number | undefined,
    totalClinic?: number | undefined
    scheduling?: Scheduling | undefined
}
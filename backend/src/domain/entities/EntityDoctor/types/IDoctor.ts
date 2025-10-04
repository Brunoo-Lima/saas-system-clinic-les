
import { Address } from "../../EntityAddress/Address"
import { Clinic } from "../../EntityClinic/Clinic"
import { Period } from "../../EntityPeriod/Period"
import { Specialty } from "../../EntitySpecialty/Specialty"
import { User } from "../../EntityUser/User"
import { IPerson } from "../../IPerson"

export interface IDoctor extends IPerson{
    crm?: string  | undefined
    specialties?: Array<Specialty>  | undefined
    phone?: string  | undefined
    periodsToWork?: Array<Period>  | undefined
    percentDistribution?: number  | undefined,
    user?: User  | undefined
    clinic?: Clinic  | undefined
    address?: Address  | undefined
}
import { Address } from "../../entities/EntityAddress/Address"
import { Clinic } from "../../entities/EntityClinic/Clinic"
import { Period } from "../../entities/EntityPeriod/Period"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"
import { User } from "../../entities/EntityUser/User"
import { IPerson } from "../Person/IPerson"

export interface IDoctor extends IPerson{
    crm?: string
    specialties?: Array<Specialty>
    phone?: string
    periodsToWork?: Array<Period>
    percentDistribution?: number,
    user?: User
    clinic?: Clinic
    address?: Address
}
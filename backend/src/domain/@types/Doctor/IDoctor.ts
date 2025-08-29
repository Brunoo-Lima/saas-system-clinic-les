import { Clinic } from "../../entities/EntityClinic/Clinic"
import { Contact } from "../../entities/EntityContact/Contact"
import { Period } from "../../entities/EntityPeriod/Period"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"
import { User } from "../../entities/EntityUser/User"
import { IPerson } from "../Person/IPerson"

export interface IDoctor extends IPerson{
    crm: string
    specialties: Array<Specialty>
    contacts: Array<Contact>
    periodsToWork: Array<Period>
    user: User
    clinic: Clinic
}
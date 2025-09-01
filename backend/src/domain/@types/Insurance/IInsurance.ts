import { Specialty } from "../../entities/EntitySpecialty/Specialty"

export interface IInsurance {
    type: string
    specialties: Array<Specialty>
}
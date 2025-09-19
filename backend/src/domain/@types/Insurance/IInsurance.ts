import { Modality } from "../../entities/EntityModality/Modality"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"

export interface IInsurance {
    id?: string
    name?: string
    modalities?: Array<Modality>
    specialties?: Array<Specialty>
}
import { Modality } from "../../EntityModality/Modality"
import { Specialty } from "../../EntitySpecialty/Specialty"

export interface IInsurance {
    id?: string | undefined
    name?: string | undefined
    modalities?: Array<Modality> | undefined
    specialties?: Array<Specialty> | undefined
}
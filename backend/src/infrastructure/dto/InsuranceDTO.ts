import { IModality } from "../../domain/@types/Modality/IModality";
import { SpecialtiesDTO } from "./SpecialtiesDTO";

export interface InsuranceDTO {
    id?: string,
    name: string,
    modalities?: Array<IModality>
    specialties: SpecialtiesDTO
}
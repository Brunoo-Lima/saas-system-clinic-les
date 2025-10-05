import { ModalityDTO } from "./ModalityDTO";
import { SpecialtiesDTO } from "./SpecialtiesDTO";

export interface InsuranceDTO {
    id?: string,
    name: string,
    modalities?: Array<ModalityDTO>
    specialties: SpecialtiesDTO
}
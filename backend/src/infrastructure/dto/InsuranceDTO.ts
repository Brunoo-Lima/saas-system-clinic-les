import { SpecialtiesDTO } from "./SpecialtiesDTO";

export interface InsuranceDTO {
    id?: string,
    type: string,
    specialties: SpecialtiesDTO
}
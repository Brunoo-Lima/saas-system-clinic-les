import { InsuranceDTO } from "./InsuranceDTO";
import { ModalityDTO } from "./ModalityDTO";

export interface CardDTO {
    id: string,
    insurance: InsuranceDTO,
    cardInsuranceNumber: string
    validate: Date;
    modality: ModalityDTO
}
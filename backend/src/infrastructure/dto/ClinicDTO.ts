import { AddressDTO } from "./AddressDTO"
import { InsuranceDTO } from "./InsuranceDTO"
import { SpecialtiesDTO } from "./SpecialtiesDTO"
import { UserDTO } from "./UserDTO"

export interface ClinicDTO {
    name?: string
    insurances?: Array<InsuranceDTO>
    timeToConfirm?: number // Tempo para disparar a confirmacao de agendamento
    specialties?: SpecialtiesDTO
    phone?: string
    user?: UserDTO,
    cnpj?: string;
    address?: AddressDTO
}


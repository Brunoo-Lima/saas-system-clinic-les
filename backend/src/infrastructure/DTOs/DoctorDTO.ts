import { AddressDTO } from "./AddressDTO"
import { ClinicDTO } from "./ClinicDTO"
import { PeriodDTO } from "./PeriodDTO"
import { SpecialtiesDTO } from "./SpecialtiesDTO"
import { UserDTO } from "./UserDTO"

export interface DoctorDTO {
    id?: string,
    name?: string,
    cpf?: string,
    crm?:string
    sex?:string
    phone?: string
    dateOfBirth?: string,
    user?: UserDTO,
    specialties?: SpecialtiesDTO
    periodToWork?: Array<PeriodDTO>,
    percentDistribution?: number,
    clinic?: ClinicDTO
    address?: AddressDTO
}
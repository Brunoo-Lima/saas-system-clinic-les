import { Address } from "../../entities/EntityAddress/Address"
import { Insurance } from "../../entities/EntityInsurance/Insurance"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"
import { User } from "../../entities/EntityUser/User"

export interface IClinic {
    name: string
    insurances: Array<Insurance>
    timeToConfirm: number // Tempo para disparar a confirmacao de agendamento
    specialties: Array<Specialty>
    contact: string
    user:User,
    address: Address
}
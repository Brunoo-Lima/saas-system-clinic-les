import { Document } from "../../entities/Document"
import { Address } from "../../entities/EntityAddress/Address"
import { Contact } from "../../entities/EntityContact/Contact"
import { Insurance } from "../../entities/EntityInsurance/Insurance"
import { Specialty } from "../../entities/EntitySpecialty/Specialty"

export interface IClinic {
    name: string
    documents: Array<Document>
    insurances: Array<Insurance>
    timeToConfirm: number // Tempo para disparar a confirmacao de agendamento
    specialties: Array<Specialty>
    contacts: Array<Contact>
    address: Address
}
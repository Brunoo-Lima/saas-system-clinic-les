import { IAddressDTO } from "./IAddressDTO"

export interface PatientDTO {
    user_id?: string,
    name: string,
    dateOfBirth: string,
    cpf: string,
    contact: string,
    insurances: [
        {
            id: string,
            name: string
        }
    ],
    address: IAddressDTO
}
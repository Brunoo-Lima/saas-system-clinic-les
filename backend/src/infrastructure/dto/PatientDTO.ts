import { AddressDTO } from "./AddressDTO";
import { CardDTO } from "./CardDTO";
import { UserDTO } from "./UserDTO";


export interface PatientDTO {
    user: UserDTO,
    sex: string,
    name: string,
    dateOfBirth: string,
    cpf: string,
    phone: string,
    cardInsurances: Array<CardDTO>
    address: AddressDTO
}
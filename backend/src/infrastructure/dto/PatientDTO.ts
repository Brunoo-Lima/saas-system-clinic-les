import { IInsurance } from "../../domain/@types/Insurance/IInsurance"
import { IModality } from "../../domain/@types/Modality/IModality";
import { AddressDTO } from "./AddressDTO";
import { UserDTO } from "./UserDTO";

export interface PatientDTO {
    user: UserDTO,
    sex: string,
    name: string,
    dateOfBirth: string,
    cpf: string,
    phone: string,
    cardInsurances: [
        {
            insurance: IInsurance,
            cardInsuranceNumber: string
            validate: Date;
            modality: IModality
        }
    ],
    address: AddressDTO
}
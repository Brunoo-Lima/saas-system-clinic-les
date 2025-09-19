import { IInsurance } from "../../domain/@types/Insurance/IInsurance"
import { IModality } from "../../domain/@types/Modality/IModality";
import { IAddressDTO } from "./AddressDTO"
import { UserDTO } from "./UserDTO";

export interface PatientDTO {
    user: UserDTO,
    name: string,
    dateOfBirth: string,
    cpf: string,
    phone: string,
    cartInsurances: [
        {
            insurance: IInsurance,
            cartInsuranceNumber: string
            validate: Date;
            modality: IModality
        }
    ],
    address: IAddressDTO
}
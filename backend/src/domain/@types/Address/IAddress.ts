import { Neighborhood } from "../../entities/EntityAddress/Neighborhood"

export interface IAddress {
    nameAddress: string
    neighborhood: Neighborhood,
    cep: string,
    street: string
}
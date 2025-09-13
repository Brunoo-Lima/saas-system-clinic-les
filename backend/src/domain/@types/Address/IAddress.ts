import { City } from "../../entities/EntityAddress/City"

export interface IAddress {
    nameAddress?: string
    city?: City,
    cep?: string,
    number?: string,
    street?: string
}
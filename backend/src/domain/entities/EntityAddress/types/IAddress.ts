import { City } from "../City"

export interface IAddress {
    nameAddress?: string | undefined
    neighborhood?: string | undefined,
    city?: City | undefined,
    cep?: string | undefined,
    number?: string | undefined,
    street?: string | undefined
}
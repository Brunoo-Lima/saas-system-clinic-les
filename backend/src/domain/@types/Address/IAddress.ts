import { Neighborhood } from "../../entities/EntityAddress/Neighborhood"

export interface IAddress {
    nameAddress?: string
    neighborhood?: Neighborhood,
    number?: string,
    street?: string
}
import { Country } from "../../entities/EntityAddress/Country"

export interface IState {
    uf?: string
    name?: string
    country?: Country
}
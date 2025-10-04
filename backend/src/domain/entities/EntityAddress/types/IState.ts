import { Country } from "../Country"

export interface IState {
    uf?: string | undefined
    name?: string | undefined
    country?: Country | undefined
}
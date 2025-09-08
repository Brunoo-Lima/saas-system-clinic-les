import { State } from "../../entities/EntityAddress/State"

export interface ICity {
    cep?: string,
    name?: string,
    state?: State
}
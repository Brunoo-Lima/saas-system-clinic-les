import { State } from "../../entities/EntityAddress/State"

export interface IDocument {
    type: string
    identifierCode: string
    registerFrom: State
}
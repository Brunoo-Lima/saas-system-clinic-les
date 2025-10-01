import { Insurance } from "../../entities/EntityInsurance/Insurance"
import { Modality } from "../../entities/EntityModality/Modality"

export interface ICardInsurance {
    validate?: Date,
    cardNumber?: string
    modality?: Modality
    insurance?: Insurance,
}
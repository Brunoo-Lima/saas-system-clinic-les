import { Insurance } from "../../EntityInsurance/Insurance"
import { Modality } from "../../EntityModality/Modality"

export interface ICardInsurance {
    validate?: Date | undefined,
    cardNumber?: string | undefined
    modality?: Modality | undefined
    insurance?: Insurance | undefined,
}
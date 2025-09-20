import { Insurance } from "../../entities/EntityInsurance/Insurance"

export interface ICartInsurance {
    validate?: Date,
    cartNumber?: string
    insurance?: Insurance,
}
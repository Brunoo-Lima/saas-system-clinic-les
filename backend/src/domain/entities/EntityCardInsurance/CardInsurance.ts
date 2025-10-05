import { ICardInsurance } from "./types/ICardInsurance";
import { EntityDomain } from "../EntityDomain";

export class CardInsurance extends EntityDomain {
    constructor(
        private cardInsuranceProps: ICardInsurance
    ) {
        super()
    }

    public get cardNumber() {
        return this.cardInsuranceProps.cardNumber
    }

    public get validate() {
        return this.cardInsuranceProps.validate
    }

    public get insurance() {
        return this.cardInsuranceProps.insurance
    }

    public get modality() {
        return this.cardInsuranceProps.modality
    }

    public get props() {
        return this.cardInsuranceProps
    }

}
import { ISpecialty } from "./types/ISpecialty";
import { EntityDomain } from "../EntityDomain";

export class Specialty extends EntityDomain {
    constructor(
        private specialtyProps: ISpecialty
    ) {
        super()
    }
    public get name() {
        return this.specialtyProps.name
    }
    public get price() {
        return this.specialtyProps.price
    }
    public get amountTransferred() {
        return this.specialtyProps.amountTransferred
    }

    public get props() {
        return this.specialtyProps
    }

}
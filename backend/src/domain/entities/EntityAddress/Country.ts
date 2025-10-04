import { ICountry } from "./types/ICountry";
import { EntityDomain } from "../EntityDomain";

export class Country extends EntityDomain {
    constructor(
        private countryProps: ICountry
    ) {
        super()
    }

    public get name() {
        return this.countryProps.name
    }

}
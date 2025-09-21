import { ICity } from "../../@types/Address/ICity";
import { EntityDomain } from "../EntityDomain";

export class City extends EntityDomain {
    constructor(
        private cityProps: ICity
    ) {
        super()
    }
    public get state() {
        return this.cityProps.state
    }
    public get name() {
        return this.cityProps.name
    }
    
}
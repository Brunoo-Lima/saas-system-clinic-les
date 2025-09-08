import { ICity } from "../../@types/Address/ICity";
import { EntityDomain } from "../EntityDomain";
import { State } from "./State";

export class City extends EntityDomain {
    constructor(
        private cityProps: ICity
    ) {
        super()
    }

    public get cep() {
        return this.cityProps.cep
    }
    public get state() {
        return this.cityProps.state
    }
    public get name() {
        return this.cityProps.name
    }
    
}
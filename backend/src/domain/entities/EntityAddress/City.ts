import { ICity } from "../../@types/Address/ICity";
import { EntityDomain } from "../EntityDomain";

export class City extends EntityDomain {
    constructor(
        private cityProps: ICity
    ) {
        super()
    }
}
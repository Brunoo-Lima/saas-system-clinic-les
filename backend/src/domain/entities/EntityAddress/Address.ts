// Update the import path below if the IAddress type is located elsewhere, for example:
import { IAddress } from "../../@types/Address/IAddress";
import { EntityDomain } from "../EntityDomain";

export class Address extends EntityDomain {
    constructor(
        private addressProps: IAddress
    ) {
        super()
    }

}
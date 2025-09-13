// Update the import path below if the IAddress type is located elsewhere, for example:
import { IAddress } from "../../@types/Address/IAddress";
import { EntityDomain } from "../EntityDomain";

export class Address extends EntityDomain {
    constructor(
        private addressProps: IAddress
    ) {
        super()
    }
    public get props (){
        return this.addressProps
    }
    public get nameAddress() {
        return this.addressProps.nameAddress
    }
    public get city() {
        return this.addressProps.city
    }
    public get street() {
        return this.addressProps.street
    }
    public get cep(){
        return this.addressProps.cep;
    }
    
    public get number() {
        return this.addressProps.number
    }
    
    
}
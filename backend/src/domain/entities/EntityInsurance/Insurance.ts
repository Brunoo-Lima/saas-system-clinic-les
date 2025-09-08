import { IInsurance } from "../../@types/Insurance/IInsurance";
import { EntityDomain } from "../EntityDomain";

export class Insurance extends EntityDomain {
    constructor(
        private insuranceProps: IInsurance
    ){
        super()
    }
    
    public get type() {
        return this.insuranceProps.type
    }
    
    public get specialties() {
        return this.insuranceProps.specialties
    }
}
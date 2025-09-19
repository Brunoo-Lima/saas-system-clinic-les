import { IInsurance } from "../../@types/Insurance/IInsurance";
import { EntityDomain } from "../EntityDomain";

export class Insurance extends EntityDomain {
    constructor(
        private insuranceProps: IInsurance
    ){
        super()
    }
    
    public get name() {
        return this.insuranceProps.name
    }
    
    public get specialties() {
        return this.insuranceProps.specialties
    }

    public get modalities() {
        return this.insuranceProps.modalities
    }
   
}
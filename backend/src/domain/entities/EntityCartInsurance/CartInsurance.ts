import { ICartInsurance } from "../../@types/CartInsurance/ICartInsurance";
import { EntityDomain } from "../EntityDomain";

export class CartInsurance extends EntityDomain{ 
    constructor(
        private cartInsuranceProps: ICartInsurance
    ){ 
        super()
    }
}

import { Address } from "../../entities/EntityAddress/Address";
import { CartInsurance } from "../../entities/EntityCartInsurance/CartInsurance";
import { User } from "../../entities/EntityUser/User";
import { IPerson } from "../Person/IPerson";

export interface IPatient extends IPerson {
    cartInsurances?: CartInsurance[],
    phone?: string,
    address?: Address
    user?: User
}
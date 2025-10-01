
import { Address } from "../../entities/EntityAddress/Address";
import { CardInsurance } from "../../entities/EntityCardInsurance/CardInsurance";
import { User } from "../../entities/EntityUser/User";
import { IPerson } from "../Person/IPerson";

export interface IPatient extends IPerson {
    cardInsurances?: CardInsurance[],
    phone?: string,
    address?: Address
    user?: User
}

import { Address } from "../../entities/EntityAddress/Address";
import { CardInsurance } from "../../entities/EntityCardInsurance/CardInsurance";
import { User } from "../../entities/EntityUser/User";
import { IPerson } from "../Person/IPerson";

export interface IPatient extends IPerson {
    phone?: string,
    address?: Address
    user?: User
}
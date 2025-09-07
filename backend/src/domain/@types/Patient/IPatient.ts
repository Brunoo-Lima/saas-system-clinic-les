
import { Address } from "../../entities/EntityAddress/Address";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { User } from "../../entities/EntityUser/User";
import { IPerson } from "../Person/IPerson";

export interface IPatient extends IPerson {
    insurances?: Insurance[],
    contact?: string,
    address?: Address
    user?: User
}
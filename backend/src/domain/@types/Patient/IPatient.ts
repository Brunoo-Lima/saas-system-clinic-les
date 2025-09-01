
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { User } from "../../entities/EntityUser/User";
import { IPerson } from "../Person/IPerson";

export interface IPatient extends IPerson {
    insurances: Insurance[],
    contacts: string
    user: User
}
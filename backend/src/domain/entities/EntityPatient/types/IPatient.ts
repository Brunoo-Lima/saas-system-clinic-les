
import { Address } from "../../EntityAddress/Address";
import { User } from "../../EntityUser/User";
import { IPerson } from "../../IPerson";

export interface IPatient extends IPerson {
    phone?: string | undefined,
    address?: Address | undefined
    user?: User | undefined
}
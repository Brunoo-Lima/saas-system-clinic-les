import { IDoctor } from "../../@types/Doctor/IDoctor";
import { User } from "../EntityUser/User";
import { Person } from "../Person";

export class Doctor extends Person {
    constructor(
        private doctorProps: IDoctor
    ){
        super(
            {
                cpf: doctorProps.cpf ?? "",
                dateOfBirth: doctorProps.dateOfBirth,
                name: doctorProps.name ?? ""
            }
        )
    }
    get user(): User {
        return this.doctorProps.user
    }
}
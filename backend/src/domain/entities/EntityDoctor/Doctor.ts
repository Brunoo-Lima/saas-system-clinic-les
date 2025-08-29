import { IDoctor } from "../../@types/Doctor/IDoctor";
import { Person } from "../Person";

export class Doctor extends Person {
    constructor(
        private doctorProps: IDoctor
    ){
        super(
            {
                dateOfBirth: doctorProps.dateOfBirth,
                document: doctorProps.document,
                name: doctorProps.name
            }
        )
    }
}
import { IPatient } from "../../@types/Patient/IPatient";
import { Person } from "../Person";

export class Patient extends Person {
    constructor(
        private patientProps: IPatient
    ){
        super({
            dateOfBirth: patientProps.dateOfBirth,
            document: patientProps.document,
            name: patientProps.name
        })
    }
}
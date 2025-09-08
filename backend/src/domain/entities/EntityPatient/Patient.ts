import { IPatient } from "../../@types/Patient/IPatient";
import { User } from "../EntityUser/User";
import { Person } from "../Person";

export class Patient extends Person {
    constructor(
        private patientProps: IPatient
    ){
        super({
            dateOfBirth: patientProps.dateOfBirth,
            cpf: patientProps.cpf ?? "",
            name: patientProps.name ?? ""
        })
    }
    
    public get props (){
        return this.patientProps
    }
    public get user() : User | undefined{
        return this.patientProps.user
    }
    
    public get contact() {
        return this.patientProps.contact
    }
    
    public get insurances(){
        return this.patientProps.insurances
    }

    public get address(){
        return this.patientProps.address
    }
    
}

import { Person } from "../Person";
import { IDoctor } from "./types/IDoctor";

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
    get user() {
        return this.doctorProps.user
    }
    
    public get periodToWork() {
        return this.doctorProps.periodsToWork
    }
    
    public get crm() {
        return this.doctorProps.crm
    }
    
    public get phone() {
        return this.doctorProps.phone
    }
    
    public get sex() {
        return this.doctorProps.sex
    }
    
    public get specialties() {
        return this.doctorProps.specialties
    }
    
    public get address() {
        return this.doctorProps.address
    }  
    
    public get percentDistribution() {
        return this.doctorProps.percentDistribution
    }

    public get props () {
        return this.doctorProps
    }
}   
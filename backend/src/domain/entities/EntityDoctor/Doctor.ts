import { IDoctor } from "../../@types/Doctor/IDoctor";
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
    
    public get clinic() {
        return this.doctorProps.clinic
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
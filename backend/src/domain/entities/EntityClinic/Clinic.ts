import { IClinic } from "../../@types/Clinic/IClinic";
import { EntityDomain } from "../EntityDomain";
import { User } from "../EntityUser/User";

export class Clinic extends EntityDomain {
    constructor(
        private clinicProps: IClinic
    ){
        super()
    }
    
    public get user() : User {
        return this.clinicProps.user
    }
    
}
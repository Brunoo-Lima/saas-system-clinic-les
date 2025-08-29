import { IClinic } from "../../@types/Clinic/IClinic";
import { EntityDomain } from "../EntityDomain";

export class Clinic extends EntityDomain {
    constructor(
        private clinicProps: IClinic
    ){
        super()
    }
}
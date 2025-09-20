import { IModality } from "../../@types/Modality/IModality";
import { EntityDomain } from "../EntityDomain";

export class Modality extends EntityDomain{
    constructor(
        private modalityProps: IModality
    ){ 
        super()
    }
    
}
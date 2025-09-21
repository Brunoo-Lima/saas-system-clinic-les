import { IModality } from "../../@types/Modality/IModality";
import { EntityDomain } from "../EntityDomain";

export class Modality extends EntityDomain{
    constructor(
        private modalityProps: IModality
    ){ 
        super()
    }
    
    public get name() : string {
        return this.modalityProps.name
    }
    
    public get props() {
        return this.modalityProps
    }
    
}
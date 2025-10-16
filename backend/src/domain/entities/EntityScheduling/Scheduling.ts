import { IScheduling } from "./types/IScheduling";
import { EntityDomain } from "../EntityDomain";

export class Scheduling extends EntityDomain {
    constructor(
        private schedulingProps: IScheduling
    ) {
        super()
    }

    public get date() {
        return this.schedulingProps.date
    }
    
    public get dateOfConfirmation() {
        return this.schedulingProps.dateOfConfirmation
    }

    public get doctor() {
        return this.schedulingProps.doctor
    }
    public get insurance() {
        return this.schedulingProps.insurance
    }
    public get isReturn() {
        return this.schedulingProps.isReturn
    }
    public get patient() {
        return this.schedulingProps.patient
    }
    public get priceOfConsultation() {
        return this.schedulingProps.priceOfConsultation
    }

    public get specialty() {
        return this.schedulingProps.specialty
    }
    public get status() {
        return this.schedulingProps.status
    }
    
    public get props() {
        return this.schedulingProps
    }
    
}
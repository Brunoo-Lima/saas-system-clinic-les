import { get } from "https";
import { EntityDomain } from "../EntityDomain";
import { IDoctorScheduling } from "./types/IDocotorScheduling";

export class DoctorScheduling extends EntityDomain{
    constructor(private doctorSchedulingProps: IDoctorScheduling){
        super()
    }
    public get dayFrom() {
        return this.doctorSchedulingProps.dayFrom
    }

    public get dayTo() {
        return this.doctorSchedulingProps.dayTo
    }

    public get is_activate() {
        return this.doctorSchedulingProps.is_activate
    }
    
    public get doctor() {
        return this.doctorSchedulingProps.doctor
    }
    
    public get props() {
        return this.doctorSchedulingProps
    }
    public get datesBlocked() {
        return this.doctorSchedulingProps.datesBlocked
    }
}
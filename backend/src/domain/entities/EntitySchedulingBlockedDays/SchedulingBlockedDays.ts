import { EntityDomain } from "../EntityDomain";
import { ISchedulingBlockedDays } from "./types/ISchedulingBlockedDays";

export class SchedulingBlockedDays extends EntityDomain{
    constructor(private schedulingBlockedProps: ISchedulingBlockedDays){
        super()
    }
    
    public get dateBlocked() {
        return this.schedulingBlockedProps.dateBlocked
    }
    
    public get reason() {
        return this.schedulingBlockedProps.reason
    }
    
}
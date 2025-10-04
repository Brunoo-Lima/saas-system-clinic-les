import { IPeriod } from "./types/IPeriod";
import { EntityDomain } from "../EntityDomain";

export class Period extends EntityDomain {
    constructor(
        private periodProps: IPeriod
    ){
        super()
    }
    
    public get dayWeek () {
        return this.periodProps.dayWeek
    }
    
    public get periodType() {
        return this.periodProps.periodType
    }
    
    public get timeFrom() {
        return this.periodProps.timeFrom
    }
    
    public get timeTo() {
        return this.periodProps.timeTo
    }
    public get props(){
        return this.periodProps
    }
}
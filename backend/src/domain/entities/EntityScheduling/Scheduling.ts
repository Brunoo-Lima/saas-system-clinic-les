import { IScheduling } from "../../@types/Scheduling/Scheduling";
import { EntityDomain } from "../EntityDomain";

export class Scheduling extends EntityDomain {
    constructor(
        private schedulingProps: IScheduling
    ){
        super()
    }
}
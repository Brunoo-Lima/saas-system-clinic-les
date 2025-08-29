import { IPeriod } from "../../@types/Period/IPeriod";
import { EntityDomain } from "../EntityDomain";

export class Period extends EntityDomain {
    constructor(
        private periodProps: IPeriod
    ){
        super()
    }
}
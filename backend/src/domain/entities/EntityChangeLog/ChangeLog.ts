import { EntityDomain } from "../EntityDomain";
import { IChangeLog } from "./types/IChangeLog";

export class ChangeLog extends EntityDomain{
    constructor(private changeLogProps: IChangeLog){
        super()
    }
}
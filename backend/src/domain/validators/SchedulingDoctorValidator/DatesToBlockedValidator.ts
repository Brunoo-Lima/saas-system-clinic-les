import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingBlockedDays } from "../../entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { IProcessValidator } from "../IProcessValidator";

export class DatesToBlockedValidator implements IProcessValidator{
    async valid(datesToBlocked: Array<SchedulingBlockedDays>){
        try {
            const timesFiltered = datesToBlocked.filter((dtb) => dtb.dateBlocked).map((dtb) => dtb.dateBlocked?.getTime())
            if(!timesFiltered.length) return ResponseHandler.error("Anyone dates to blocked is valid !")
            const datesNotDuplicates = new Set(timesFiltered) 
            if(datesNotDuplicates.size !== timesFiltered.length) return ResponseHandler.error("Cannot be inserted duplicate dates !")
            
            return ResponseHandler.success(datesToBlocked, "The dates is valid, you can inserted !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
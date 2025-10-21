import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class DateSchedulingValidator implements IProcessValidator {
    async valid(scheduling: Scheduling) {
        try { 
            const dateNow = new Date()
            const dateScheduling = scheduling.date

            if(!dateScheduling) return ResponseHandler.error("The date Scheduling is required to confirm.")
            if(dateScheduling?.getDate() < dateNow.getDate()) return ResponseHandler.error("Cannot be scheduling confirm because the date is less than now !")
            
            return ResponseHandler.success("The date of scheduling is valid")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
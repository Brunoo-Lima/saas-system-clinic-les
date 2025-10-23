import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class DateSchedulingValidator implements IProcessValidator {
    async valid(scheduling: Scheduling) {
        try { 
            const dateNow = new Date()
            const dateScheduling = scheduling.date

            if(!dateScheduling) return ResponseHandler.error("The date Scheduling is required to confirm.")
            if (dateScheduling.getTime() < dateNow.getTime()) {
                return ResponseHandler.error( 'Cannot confirm scheduling because the date is before today!');
            }
            return ResponseHandler.success("The date of scheduling is valid")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
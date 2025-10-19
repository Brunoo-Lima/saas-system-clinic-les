import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { EntityDomain } from "../../entities/EntityDomain";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class StatusValidationToUpdated implements IProcessValidator {
    async valid(scheduling: Scheduling){
        try {
            return ResponseHandler.success()
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
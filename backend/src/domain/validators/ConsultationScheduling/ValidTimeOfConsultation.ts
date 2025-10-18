import {  ResponseHandler } from "../../../helpers/ResponseHandler";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class ValidTimeOfConsultation implements IProcessValidator {
    valid(scheduling: Scheduling){
        try {
            
            return ResponseHandler.success()
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }   
}
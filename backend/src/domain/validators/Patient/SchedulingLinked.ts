import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/Queries/SchedulingQueriesDAO";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class SchedulingLinked implements IProcessValidator {
    async valid(scheduling: Scheduling){
        try {
            const schedulingDAO = new SchedulingQueriesDAO()
            const existsSchedulingByPatient = await schedulingDAO.existsSchedulingByPatient(scheduling)
            return existsSchedulingByPatient
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
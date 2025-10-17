import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/SchedulingQueriesDAO";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class ExistsScheduling implements IProcessValidator {
    async valid(scheduling: Scheduling){
        try {
            const schedulingDao = new SchedulingQueriesDAO()
            const schedulingToDoctorExists = await schedulingDao.schedulingPerDoctor(scheduling)
            if(Array.isArray(schedulingToDoctorExists.data) && schedulingToDoctorExists.data.length){
                const schedulingIsValid = schedulingToDoctorExists.data.filter((sc) => {
                    scheduling.date && (scheduling.date?.getDate() <= (sc.date as Date).getDate())
                })
                if(schedulingIsValid.length) return ResponseHandler.error("The scheduling cannot be confirmed because already exists the scheduling in this date")
            }
            return ResponseHandler.success(scheduling, "Success ! The scheduling can be inserted")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
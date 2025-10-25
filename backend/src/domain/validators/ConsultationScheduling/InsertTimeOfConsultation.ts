import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/Queries/SchedulingQueriesDAO";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class InsertTimeOfConsultation implements IProcessValidator {
    async valid(scheduling: Scheduling, repository: IRepository) {
        try {
            const schedulingCopy = Object.assign(scheduling)
            if (scheduling.status === "CONCLUDE") {
                if (!(schedulingCopy.dateOfRealizable instanceof Date) || isNaN(schedulingCopy.dateOfRealizable.getTime())) {
                    return ResponseHandler.error(
                        "The status scheduling is marked as CONCLUDE, but the dateOfRealizable sent is invalid."
                    );
                }


                const schedulingData: Array<any> | IResponseHandler = await repository.findEntity(scheduling);
                const schedulingQueriesDAO = new SchedulingQueriesDAO()
                if (!Array.isArray(schedulingData)) return schedulingData

                if (schedulingData.length === 0) return ResponseHandler.error("Does't exists scheduling with this id.")

                schedulingCopy.specialty?.setUuidHash(schedulingData[0].specialty_id)
                schedulingCopy.date = schedulingData[0].date
                scheduling.dateOfRealizable?.setHours(scheduling.dateOfRealizable.getHours() - 3) // Altero para o horário padrao de brasilia

                const avgScheduling: any = await schedulingQueriesDAO.avgTimeOfConsultation(schedulingCopy)
                scheduling.timeOfConsultation = avgScheduling.data?.avg_consultation ?? "01:00:00"
                return ResponseHandler.success(scheduling, "Time of consultation inserted")
            }

            return ResponseHandler.success({}, "The scheduling can update")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }

}
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/Queries/SchedulingQueriesDAO";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class StatusValidationToUpdated implements IProcessValidator {
    async valid(scheduling: Scheduling) {
        try {
            if (scheduling.status?.toLowerCase() !== "canceled") return ResponseHandler.success(scheduling, "You can updated the scheduling.")
            const schedulingDAO = new SchedulingQueriesDAO()
            const schedulingPerDoctor = await schedulingDAO.schedulingPerDoctor(scheduling)
            const dataScheduling = schedulingPerDoctor.data
            if (Array.isArray(dataScheduling)) {
                const dateMarked = dataScheduling[0].date as Date
                dateMarked.setHours(dateMarked.getHours() - 3)

                const dateNow = new Date()
                const diffDates = dateMarked.getTime() - dateNow.getTime()
                const days = 1000 * 60 * 60 * 24;
                const totalDays = Math.round(diffDates / days)

                if (totalDays <= 1) return ResponseHandler.error("You cannot canceled the consultation after 24 hours !")
            }

            return ResponseHandler.success(scheduling, "The scheduling can be updated !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
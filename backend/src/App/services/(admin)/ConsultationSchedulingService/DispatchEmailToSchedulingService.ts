import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../../infrastructure/database/DAO/SchedulingQueriesDAO";
import { queueScheduling } from "../../../../infrastructure/queue/queue_email_client";

export class DispatchEmailToSchedulingService {
    async execute() {
        try {
            const schedulingQueriesDAO = new SchedulingQueriesDAO()
            const schedulingToConfirm = await schedulingQueriesDAO.getNextScheduling()
            
            if (!Array.isArray(schedulingToConfirm)) return ResponseHandler.error("Error to find the scheduling")
            schedulingToConfirm.forEach(async (sch) => {
                sch.template = "scheduling"
                await queueScheduling.add("scheduling", {
                    ...sch.scheduling as Object,
                    template: "scheduling",
                })
            })

            return ResponseHandler.success([], "Success ! Emails sended")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../../infrastructure/database/DAO/Queries/SchedulingQueriesDAO";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { queueScheduling } from "../../../../infrastructure/queue/queue_email_client";

export class DispatchEmailToSchedulingService {
    private repository: IRepository;
    constructor() {
        this.repository = new ConsultationSchedulingRepository()
    }
    async execute() {
        try {
            const schedulingQueriesDAO = new SchedulingQueriesDAO()
            const schedulingToConfirm = await schedulingQueriesDAO.getNextScheduling()

            if (!Array.isArray(schedulingToConfirm)) return ResponseHandler.error("Error to find the scheduling")

            schedulingToConfirm.map(async (sch: any) => {
                const scheduling = new SchedulingBuilder()
                    .setStatus("CONFIRMATION_PENDING")
                    .build()
                scheduling.setUuidHash(sch.scheduling.id ?? "")
                const schedulingUpdated = await this.repository.updateEntity(scheduling)
                sch.template = "scheduling"

                await queueScheduling.add("scheduling", { ...sch.scheduling as Object, template: "scheduling" })
                return schedulingUpdated
            })

            return ResponseHandler.success([], "Success ! Emails sended")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { RequestCancelSchedulingService } from "../../../services/(admin)/ConsultationSchedulingService/RequestCancelSchedulingService";

export class RequestCancelSchedulingController {
    async handle(req: Request, res: Response){
        try {
            const schedulingDTO = req.body as ConsultationSchedulingDTO
            const service = new RequestCancelSchedulingService()
            const schedulingUpdated = await service.execute(schedulingDTO)
            return res.status(200).json(schedulingUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
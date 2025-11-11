import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { RequestConfirmationSchedulingService } from "../../../services/(admin)/ConsultationSchedulingService/RequestConfirmationSchedulingService";

export class RequestConfirmationSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const schedulingDTO = req.body as ConsultationSchedulingDTO
            const service = new RequestConfirmationSchedulingService()
            const schedulingConfirmed = await service.execute(schedulingDTO)
            return res.status(200).json(schedulingConfirmed)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
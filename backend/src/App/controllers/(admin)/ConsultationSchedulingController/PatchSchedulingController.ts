import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { PatchSchedulingService } from "../../../services/(admin)/ConsultationSchedulingService/PatchSchedulingService";

export class PatchSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.query;
            const schedulingDTO = req.body as ConsultationSchedulingDTO
            const service = new PatchSchedulingService()
            const schedulingUpdated = await service.execute(schedulingDTO, id?.toString())
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }        
    }
}
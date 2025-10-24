import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DispatchEmailToSchedulingService } from "../../../services/(admin)/ConsultationSchedulingService/DispatchEmailToSchedulingService";

export class DispatchEmailsToSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {  
            const service = new DispatchEmailToSchedulingService()
            const schedulingSended = await service.execute()
            if(!schedulingSended.success) return res.status(400).json(schedulingSended)

            return res.status(200).json(ResponseHandler.success([], "Success ! Emails sended"))
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
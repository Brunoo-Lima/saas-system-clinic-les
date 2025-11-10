import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllSchedulingService } from "../../../services/(admin)/ConsultationSchedulingService/FindAllSchedulingService";

export class FindAllSchedulingController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                scheduling_id, 
                scheduling_date, 
                doctor_id,
                patient_id,
                limit, 
                offset 
            } = req.query

            const service = new FindAllSchedulingService()
            const schedulingFounded = await service.execute({
                doctor_id: doctor_id?.toString(),
                limit: limit?.toString(),
                patient_id: patient_id?.toString(),
                offset: offset?.toString(),
                scheduling_date: scheduling_date?.toString(),
                scheduling_id: scheduling_id?.toString()
            })

            return res.status(200).json(schedulingFounded)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
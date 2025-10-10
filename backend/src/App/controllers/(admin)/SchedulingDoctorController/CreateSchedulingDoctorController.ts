import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { CreateSchedulingDoctorService } from "../../../services/(admin)/SchedulingDoctorService/CreateSchedulingDoctorService";

export class CreateSchedulingDoctorController{
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const schedulingDoctor = req.body;
            const service = new CreateSchedulingDoctorService()
            const schedulingCreated = await service.execute(schedulingDoctor)

            return res.status(200).json(schedulingCreated)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
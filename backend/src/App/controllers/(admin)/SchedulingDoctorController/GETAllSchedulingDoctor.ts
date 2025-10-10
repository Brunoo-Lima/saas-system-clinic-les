import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { GETAllSchedulingDoctorService } from "../../../services/(admin)/SchedulingDoctorService/GETAllSchedulingDoctor";

export class GETAllSchedulingDoctor {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {id, doctor_id, is_activate, offset, limit } = req.query
            const service = new GETAllSchedulingDoctorService()
            const doctorsFounded = await service.handle({
                doctor_id: doctor_id?.toString() ?? "",
                id: id?.toString() ?? "",
                is_activate: typeof is_activate === "string" ? is_activate.includes("true") : false,
                limit: limit?.toString() ?? "",
                offset: offset?.toString() ?? ""
            })

            return res.status(200).json(doctorsFounded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
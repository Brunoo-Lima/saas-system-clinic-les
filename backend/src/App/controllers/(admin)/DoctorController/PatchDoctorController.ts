import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorDTO } from "../../../../infrastructure/DTOs/DoctorDTO";
import { PatchDoctorService } from "../../../services/(admin)/DoctorService/PatchDoctorService";

export class PatchDoctorController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.query
            const doctorDTO = req.body as DoctorDTO
            const service = new PatchDoctorService()
            const doctorUpdated = await service.execute(doctorDTO, id?.toString())

            return res.status(200).json(doctorUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
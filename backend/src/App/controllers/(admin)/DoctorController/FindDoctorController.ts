import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorDTO } from "../../../../infrastructure/DTOs/DoctorDTO";
import { FindDoctorService } from "../../../services/(admin)/DoctorService/FindDoctorService";

export class FindDoctorController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorDTO = req.body as DoctorDTO
            const doctorService = new FindDoctorService()
            const doctorFounded = await doctorService.execute(doctorDTO)

            return res.status(200).json(doctorFounded)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
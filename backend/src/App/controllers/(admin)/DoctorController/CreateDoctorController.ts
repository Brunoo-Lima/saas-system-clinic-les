import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorDTO } from "../../../../infrastructure/dto/DoctorDTO";
import { CreateDoctorService } from "../../../services/(admin)/DoctorService/CreateDoctorService";

export class CreateDoctorController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const doctorDTO = req.body as DoctorDTO
            if (!doctorDTO) { return res.status(500).json(ResponseHandler.error("You can send the payload !")) }
            const doctorService = new CreateDoctorService()
            const doctorInserted = await doctorService.execute(doctorDTO)

            return res.status(200).json(doctorInserted)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
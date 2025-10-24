import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SchedulingDoctorDTO } from "../../../../infrastructure/DTOs/SchedulingDoctorDTO";
import { PatchSchedulingDoctorService } from "../../../services/(admin)/SchedulingDoctorService/PatchSchedulingDoctorService";

export class PatchSchedulingDoctorController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.query;
            const doctorSchedulingDTO = req.body as SchedulingDoctorDTO
            doctorSchedulingDTO.id = id?.toString() ?? ""
            
            const service = new PatchSchedulingDoctorService()
            const entitiesUpdated = await service.execute(doctorSchedulingDTO)
            return res.status(200).json(entitiesUpdated)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
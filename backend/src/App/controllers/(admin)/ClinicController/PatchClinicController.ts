import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ClinicDTO } from "../../../../infrastructure/DTOs/ClinicDTO";
import { PatchClinicService } from "../../../services/(admin)/ClinicService/PatchClinicService";

export class PatchClinicController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const clinicDTO = req.body as ClinicDTO
            const service = new PatchClinicService()
            const clinicUpdated = await service.execute(clinicDTO)

            return res.status(200).json(clinicUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
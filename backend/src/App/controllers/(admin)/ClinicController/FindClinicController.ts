import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ClinicDTO } from "../../../../infrastructure/DTO/ClinicDTO";
import { FindClinicService } from "../../../services/(admin)/ClinicService/FindClinicService";

export class FindClinicController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const clinicDTO = req.body as ClinicDTO
            const clinicService = new FindClinicService()
            const clinicExists = await clinicService.execute(clinicDTO)

            return res.json(clinicExists)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
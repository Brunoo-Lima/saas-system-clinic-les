import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SpecialtiesDTO } from "../../../../infrastructure/DTOs/SpecialtiesDTO";
import { DeleteSpecialtyService } from "../../../services/(admin)/ClinicService/SpecialtyService/DeleteSpecialtyService";

export class DeleteSpecialtiesController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const specialtiesDTO = req.body as SpecialtiesDTO
            const service = new DeleteSpecialtyService()
            const specialtiesDeleted = await service.execute(specialtiesDTO)

            return res.status(200).json(specialtiesDeleted)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
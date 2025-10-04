import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SpecialtiesDTO } from "../../../../infrastructure/DTO/SpecialtiesDTO";
import { UpdateSpecialtiesService } from "../../../services/(admin)/SpecialtyService/UpdateSpecialtyService";

export class UpdateSpecialtiesController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const specialtiesDTO = req.body as SpecialtiesDTO
            const serviceSpecialty = new UpdateSpecialtiesService()
            const specialtiesUpdated = await serviceSpecialty.execute(specialtiesDTO)
            return res.status(200).json(specialtiesUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
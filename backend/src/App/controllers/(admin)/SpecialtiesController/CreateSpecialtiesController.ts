import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { SpecialtyService } from "../../../services/(admin)/ClinicService/SpecialtyService/SpecialtyService";
import { SpecialtiesDTO } from "../../../../infrastructure/DTOs/SpecialtiesDTO";

export class CreateSpecialtiesController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params
            const specialtiesDTO = req.body as SpecialtiesDTO
            if (!specialtiesDTO) return res.status(400).json(ResponseHandler.error("Data not sent"))
            const specialtyService = new SpecialtyService()
            const specialtiesAdded = await specialtyService.execute(specialtiesDTO, id?.toString())

            return res.status(200).json(specialtiesAdded)
        } catch (e) {
            return res.status(500).json(
                ResponseHandler.error("Internal Server error")
            )
        }
    }
}
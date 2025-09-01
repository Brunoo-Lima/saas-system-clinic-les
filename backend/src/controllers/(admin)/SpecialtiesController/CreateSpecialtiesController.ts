import { Request, Response } from "express";
import { SpecialtyRepository } from "../../../infrastructure/repositories/SpecialtyRepository/SpecialtyRepository";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SpecialtyService } from "../../../services/(admin)/SpecialtyService/SpecialtyService";

export class CreateSpecialtiesController {
    async handle(req: Request, res: Response){
        try {
            let statusResponse = 200
            const specialtiesDTO = req.body
            const specialtyService = new SpecialtyService(new SpecialtyRepository())
            const specialtiesAdded = await specialtyService.execute(specialtiesDTO)
            
            if("error" in specialtiesAdded) statusResponse = 400
                
            return res.status(statusResponse).json(specialtiesAdded)
        } catch(e) {
            return res.status(500).json(
                ResponseHandler.error("Internal Server error")
            )
        }
    }
}
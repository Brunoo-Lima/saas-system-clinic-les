import { Request, Response, NextFunction } from "express";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { ClinicFactory } from "../../../domain/entities/EntityClinic/ClinicFactory";
import { ClinicDTO } from "../../../infrastructure/dto/ClinicDTO";

export class ClinicCreateController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const clinicDTO = req.body as ClinicDTO
            if(!clinicDTO){ return res.json(400).json(ResponseHandler.error("You can send the body request !"))}
            const clinicDomain = ClinicFactory.createFromDTO(clinicDTO)
            
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
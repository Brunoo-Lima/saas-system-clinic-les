import { NextFunction, Request, Response } from "express";
import { PatientDTO } from "../../../../infrastructure/DTOs/PatientDTO";
import { PatchPatientService } from "../../../services/(admin)/PatientService/PatchPatientService";

export class PatchPatientController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.query
            const patientDTO = req.body as PatientDTO
            const service = new PatchPatientService()
            const patientUpdated = await service.execute(patientDTO, id?.toString())
            
            return res.status(200).json(patientUpdated)
        } catch(e) {
            return res.status(500).json((e as Error).message)
        }
    }
}
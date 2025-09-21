import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { PatientDTO } from "../../../../infrastructure/dto/PatientDTO";
import { CreatePatientService } from "../../../services/(admin)/Patient/CreatePatientService";

export class CreatePatientController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const patientDTO = req.body as PatientDTO
            if (!patientDTO) return res.status(400).json(
                ResponseHandler.error("The request body cannot be empty")
            )
            const service = new CreatePatientService()
            const patientInserted = await service.execute(patientDTO)
            if (!patientInserted.success) { return res.status(400).json(patientInserted) }
            return res.status(200).json(patientInserted)

        } catch (e) {

            return res.status(500).json(
                ResponseHandler.error("Internal server error")
            )
        }
    }
}
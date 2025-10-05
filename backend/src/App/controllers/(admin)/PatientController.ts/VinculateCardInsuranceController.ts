import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { PatientDTO } from "../../../../infrastructure/DTOs/PatientDTO";
import { VinculateCardInsuranceService } from "../../../services/(admin)/PatientService/VinvulateCardInsuranceService";

export class VinculateCardInsuranceController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const patientDetailsDTO = req.body as PatientDTO
            const service = new VinculateCardInsuranceService()
            const cardInsuranceVinculate = await service.execute(patientDetailsDTO)

            return res.status(200).json(cardInsuranceVinculate)
        } catch (e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
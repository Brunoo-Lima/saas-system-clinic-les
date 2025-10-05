import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindInsuranceService } from "../../../services/(admin)/InsuranceService/FindInsuranceService";
import { InsuranceDTO } from "../../../../infrastructure/DTOs/InsuranceDTO";

export class FindInsuranceController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const insuranceDto = req.body as InsuranceDTO
            if (Object.keys(insuranceDto).length === 0) return res.status(400).json(ResponseHandler.error("Data not sent"))

            const insuranceService = new FindInsuranceService()
            const insurancesFounded = await insuranceService.execute(insuranceDto)
            return res.status(200).json(insurancesFounded)

        } catch (e) {
            return res.status(500).json(ResponseHandler.error("Internal server error"))
        }
    }
}
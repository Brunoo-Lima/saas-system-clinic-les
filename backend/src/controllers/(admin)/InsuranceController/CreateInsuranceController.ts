import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceDTO } from "../../../infrastructure/dto/InsuranceDTO";
import { CreateInsuranceService } from "../../../services/(admin)/InsuranceService/CreateInsuranceService";

export class CreateInsuranceController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const insuranceData = req.body as InsuranceDTO
            if(!insuranceData) return res.status(400).json(ResponseHandler.error("Data not sent"))
            const insuranceService = new CreateInsuranceService()
            const insuranceSaved = await insuranceService.execute(insuranceData)
            return res.status(200).json(insuranceSaved)
            
        } catch(e) {
            return res.status(500).json(ResponseHandler.error("Internal server error"))
        }
    }
}
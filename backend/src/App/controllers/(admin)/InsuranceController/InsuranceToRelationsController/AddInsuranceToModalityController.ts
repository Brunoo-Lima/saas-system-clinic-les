import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { AddInsuranceToModalityService } from "../../../../services/(admin)/InsuranceService/InsuranceToRelations/AddInsuranceToModalityService";

export class AddInsuranceToModalityController{ 
    async handle(req: Request, res: Response, next: NextFunction){
        try { 
            const insuranceDTO = req.body
            const service = new AddInsuranceToModalityService()
            const insuranceToModalityAdded = await service.execute(insuranceDTO)

            return res.status(200).json(insuranceToModalityAdded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
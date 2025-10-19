import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { AddInsuranceToSpecialtyService } from "../../../../services/(admin)/InsuranceService/InsuranceToRelations/AddInsuranceToSpecialtyService";

export class AddInsuranceToSpecialtyController{
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const insuranceDTO = req.body
            const service = new AddInsuranceToSpecialtyService()
            const specialtiesUpdated = await service.execute(insuranceDTO)

            return res.status(200).json(specialtiesUpdated)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
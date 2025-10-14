import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { PatchInsuranceToSpecialtyService } from "../../../../services/(admin)/InsuranceService/InsuranceToSpecialty/PatchInsuranceToSpecialtyService";

export class PatchInsuranceToSpecialty{
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const insuranceDTO = req.body
            const service = new PatchInsuranceToSpecialtyService()
            const specialtiesUpdated = await service.execute(insuranceDTO)

            return res.status(200).json(specialtiesUpdated)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
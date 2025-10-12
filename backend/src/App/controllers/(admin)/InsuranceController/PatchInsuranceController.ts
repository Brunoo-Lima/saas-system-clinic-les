import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { PatchInsuranceService } from "../../../services/(admin)/InsuranceService/PatchInsuranceService";

export class PatchInsuranceController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const insuranceDTO = req.body;
            const { id } = req.query;

            const service = new PatchInsuranceService()
            const insuranceUpdated = await service.execute(insuranceDTO, id?.toString() ?? "")
            return res.status(200).json(insuranceUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
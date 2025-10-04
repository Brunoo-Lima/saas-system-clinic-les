import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllInsuranceService } from "../../../services/(admin)/InsuranceService/FindAllInsuranceService";

export class FindAllInsuranceController {
    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            const { limit, offset, id } = req.query
            const service = new FindAllInsuranceService()
            const insurancesFounded = await service.execute(id?.toString(), offset?.toString(), limit?.toString())
            return res.status(200).json(insurancesFounded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FinancialDTO } from "../../../../infrastructure/DTOs/FinancialDTO";
import { CreateFinancialService } from "../../../services/(admin)/FInancialService/CreateFinancialService";

export class CreateFinancialController {
    async handle(req: Request, res: Response){
        try {
            const financialDTO = req.body as FinancialDTO
            const service = new CreateFinancialService()
            const financialCreated = await service.execute(financialDTO)
            
            return res.status(200).json(financialCreated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
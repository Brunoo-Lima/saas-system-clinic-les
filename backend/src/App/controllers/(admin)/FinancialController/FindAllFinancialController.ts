import { Request, Response } from "express";
import { FindAllFinancialService } from "../../../services/(admin)/FInancialService/FindAllFinancialService";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";

export class FindAllFinancialController {
    async handle(req: Request, res: Response){
        try {
            const { id, date, doctor_id, scheduling_id, limit, offset } = req.query
            const service = new FindAllFinancialService()
            const financialFounded = await service.execute({
                date: date?.toString(),
                doctor_id: doctor_id?.toString(),
                scheduling_id: scheduling_id?.toString(),
                id: id?.toString(),
                limit: limit?.toString(),
                offset: offset?.toString()
            })

            return res.status(200).json(financialFounded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
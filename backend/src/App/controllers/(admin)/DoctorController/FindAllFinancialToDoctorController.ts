import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllFinancialToDoctorService } from "../../../services/(admin)/DoctorService/FindAllFinancialToDoctorService";

export class FindAllFinancialToDoctorController {
    async handle(req: Request, res: Response) {
        try {
            const { id } = req.params
            const financialDoctorService = new FindAllFinancialToDoctorService()
            const allFinancial = await financialDoctorService.execute(id)
            
            return res.status(200).json(allFinancial)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
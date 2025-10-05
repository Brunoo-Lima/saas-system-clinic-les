import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllClinicService } from "../../../services/(admin)/ClinicService/FindAllClinicService";

export class FindAllClinicController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {
                id, 
                user_id,
                user_email,
                cnpj,
                offset,
                limit
            } = req.query
            
            const service = new FindAllClinicService()
            const clinicDataFounded = await service.execute({
                id: id?.toString(), 
                user_id: user_id?.toString(),
                user_email: user_email?.toString(),
                cnpj: cnpj?.toString(),
                offset: offset?.toString(),
                limit: limit?.toString()
            })
            return res.status(200).json(clinicDataFounded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
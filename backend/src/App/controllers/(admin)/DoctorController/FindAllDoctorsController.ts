import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllDoctorService } from "../../../services/(admin)/DoctorService/FindAllDoctorService";

export class FindAllDoctorController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {id, crm, cpf, limit, offset, user_id} = req.query
            const service = new FindAllDoctorService()
            const doctorsFounded = await service.execute({
                cpf: cpf?.toString(),
                crm: crm?.toString(),
                id: id?.toString(),
                user_id: user_id?.toString(),
                limit: limit?.toString(),
                offset: offset?.toString(),
            })
            return res.status(200).json(doctorsFounded)
        } catch(e){
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
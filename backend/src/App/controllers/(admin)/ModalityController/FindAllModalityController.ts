import { NextFunction, Request, Response } from "express";
import { FindAllModalityService } from "../../../services/(admin)/ModalityService/FindAllModalityService";

export class FindAllModalityController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {id, limit, offset} = req.query
            const service = new FindAllModalityService()
            const modalitiesFounded = await service.execute(id?.toString(), offset?.toString(), limit?.toString())
            return res.status(200).json(modalitiesFounded)
        } catch(e){
            return res.status(500).json()
        }
    }
}
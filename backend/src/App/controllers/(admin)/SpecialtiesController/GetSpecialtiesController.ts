import { NextFunction,Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { FindAllSpecialtyService } from "../../../services/(admin)/SpecialtyService/FindAllSpecialtyService";

export class GetSpecialtiesController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const {offset, limit} = req.query
            const service = new FindAllSpecialtyService()
            const specialtiesFounded = await service.execute(offset?.toString(), limit?.toString())

            return res.status(200).json(specialtiesFounded)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
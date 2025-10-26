import { Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { UpdatePasswordService } from "../../../services/(admin)/PrivateUserService/UpdatePasswordService";

export class UpdatePasswordController {
    async handle(req: Request, res: Response){
        try {
            const { id }= req.body
            const service = new UpdatePasswordService()
            const passwordUpdated = await service.execute(id)
            
            return res.status(202).json(passwordUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
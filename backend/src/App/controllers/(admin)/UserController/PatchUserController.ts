import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { UserDTO } from "../../../../infrastructure/DTOs/UserDTO";
import { PatchUserService } from "../../../services/(admin)/PrivateUserService/PatchUserService";

export class PatchUserController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.query
            const userDTO = req.body as UserDTO
            userDTO.id = id?.toString()

            const service = new PatchUserService()
            const userUpdated = await service.execute(userDTO)

            return res.status(200).json(userUpdated)
        } catch(e) {
            return res.status(500).json(ResponseHandler.error((e as Error).message))
        }
    }
}
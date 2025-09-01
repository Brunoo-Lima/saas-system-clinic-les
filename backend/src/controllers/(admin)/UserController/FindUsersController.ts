import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { FindUserService } from "../../../services/(admin)/User/FindUserService";
import { UserBuilder } from "../../../domain/entities/EntityUser/UserBuilder";

export class FindUserController {
    async handle(req: Request, res: Response, next: NextFunction){
        try {
            const userData = req.body
            const userDomain = new UserBuilder().setEmail(userData.email).build();
            const service = new FindUserService();
            const user = await service.execute(userDomain)
            return res.status(200).json(user)

        } catch(e){
            return res.status(500).json(
                ResponseHandler.error("Internal server error")
            )
        }
    }
}
import { Request, Response } from "express";
import { CreateUserService } from "../../services/UserPublicService/CreateUserService";
import { ResponseHandler } from "../../helpers/ResponseHandler";

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const userService = new CreateUserService();
      const newUser = await userService.execute(userData);

      if (!newUser.success) {
        return res.status(400).json(newUser);
      }

      return res.status(201).json(newUser);
    } catch (error) {
      return res
        .status(500)
        .json(ResponseHandler.error("Internal server error.", error));
    }
  }
}

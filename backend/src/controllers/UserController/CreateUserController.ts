import { Request, Response } from "express";
import { CreateUserService } from "../../services/UserService/CreateUserService";
import { ResponseHandler } from "../../helpers/ResponseHandler";
import { UserBuilder } from "../../domain/entities/User/UserBuilder";

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userData = req.body;
      const userDomain = new UserBuilder()
        .setEmail(userData.email)
        .setPassword(userData.password)
        .setRole(userData.role)
        .setAvatar(userData.avatar || "")
        .setEmailVerified(userData.emailVerified || false)
        .build();

      const userService = new CreateUserService();
      const newUser = await userService.execute(userDomain);

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

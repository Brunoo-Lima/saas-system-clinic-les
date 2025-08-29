import "dotenv/config";
import { Request, Response } from "express";
import { ResponseHandler } from "../../helpers/ResponseHandler";
import { UserBuilder } from "../../domain/entities/EntityUser/UserBuilder";
import { FindUserService } from "../../services/UserService/FindUserService";
import jwt from "jsonwebtoken";

export class AuthController {
  async handle(req: Request, res: Response) {
    try {
      const userData = req.body;
      const userDomain = new UserBuilder()
        .setEmail(userData.email)
        .setPassword(userData.password)
        .build();

      const userService = new FindUserService();
      const userExists = await userService.execute(userDomain);
      if (!userExists.success) {
        return res.status(400).json(ResponseHandler.error("User not found"));
      }
      const token = jwt.sign(
        userExists.data,
        process.env.SECRET_KEY!,
        { expiresIn: "1d" }
      );
      return res.status(200).json(ResponseHandler.success({ token }, "Authentication successful"));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseHandler.error("Internal server error.", error));
    }
  }
}
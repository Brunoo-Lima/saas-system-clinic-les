import { Router } from "express";
import { CreateUserController } from "../App/controllers/public/UserController/UserController";

const userRoutes: Router = Router();
userRoutes.post("/user", new CreateUserController().handle);

export { userRoutes };

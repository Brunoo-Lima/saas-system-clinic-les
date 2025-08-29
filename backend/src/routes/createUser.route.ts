import { Router } from "express";
import { CreateUserController } from "../controllers/UserController/CreateUserController";

const userRoutes: Router = Router();
userRoutes.post("/user", new CreateUserController().handle);

export { userRoutes };

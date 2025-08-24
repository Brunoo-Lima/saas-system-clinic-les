import { Router } from "express";
import { CreateUserController } from "../controllers/UserController/CreateUserController";

const userRoutes = Router();
userRoutes.post("/users/insert", new CreateUserController().handle);

export { userRoutes };
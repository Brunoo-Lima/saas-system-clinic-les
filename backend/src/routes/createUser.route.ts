import { Router } from "express";
import { CreateUserController } from "../controllers/UserController/CreateUserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const userRoutes: Router = Router();
userRoutes.post("/user", new CreateUserController().handle);
userRoutes.post("/user/test", authMiddleware)

export { userRoutes };

import { Router } from "express";
import { CreateUserController } from "../App/controllers/public/UserController/UserController";
import { authMiddleware } from "../App/middlewares/authMiddleware";
import { privateRoute } from "../App/middlewares/privateRoute";
import { FindUserController } from "../App/controllers/(admin)/UserController/FindUsersController";

const userRoutes: Router = Router();
userRoutes.post("/user", new CreateUserController().handle);
userRoutes.post("/user/find", authMiddleware, privateRoute, new FindUserController().handle)

export { userRoutes };
import { Router } from "express";
import { authMiddleware } from "../../App/middlewares/authMiddleware";
import { privateRoute } from "../../App/middlewares/privateRoute";
import { FindUserController } from "../../App/controllers/(admin)/UserController/FindUsersController";
import { PatchUserController } from "../../App/controllers/(admin)/UserController/PatchUserController";
import { UpdatePasswordController } from "../../App/controllers/(admin)/UserController/UpdatePasswordController";

const userPrivateRoutes: Router = Router();
userPrivateRoutes.post("/user/find", authMiddleware, privateRoute, new FindUserController().handle)
userPrivateRoutes.patch("/user", authMiddleware, privateRoute, new PatchUserController().handle)
userPrivateRoutes.patch("/user/password/reset", authMiddleware, privateRoute, new UpdatePasswordController().handle)

export { userPrivateRoutes };

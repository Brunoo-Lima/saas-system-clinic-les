import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { privateRoute } from "../../middlewares/privateRoute";
import { CreateSpecialtiesController } from "../../controllers/(admin)/SpecialtiesController/CreateSpecialtiesController";

const specialtyRoutes = Router()
specialtyRoutes.post("/specialty/add", authMiddleware, privateRoute, new CreateSpecialtiesController().handle)

export { specialtyRoutes }
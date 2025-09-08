import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { privateRoute } from "../../middlewares/privateRoute";
import { CreateSpecialtiesController } from "../../controllers/(admin)/SpecialtiesController/CreateSpecialtiesController";
import { FindSpecialtyController } from "../../controllers/(admin)/SpecialtiesController/FindSpecialtiesController";

const specialtyRoutes = Router()
specialtyRoutes.post("/specialty", authMiddleware, privateRoute, new CreateSpecialtiesController().handle)
specialtyRoutes.post("/specialty/find", authMiddleware, privateRoute, new FindSpecialtyController().handle)

export { specialtyRoutes }
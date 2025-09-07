import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { privateRoute } from "../../middlewares/privateRoute";
import { CreatePatientController } from "../../controllers/(admin)/PatientController.ts/CreatePatientController";

const patientRoutes = Router()

patientRoutes.post("/patient", authMiddleware, privateRoute, new CreatePatientController().handle)

export { patientRoutes }
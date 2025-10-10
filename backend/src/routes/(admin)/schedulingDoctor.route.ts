import { Router } from "express";
import { authMiddleware } from "../../App/middlewares/authMiddleware";
import { privateRoute } from "../../App/middlewares/privateRoute";
import { CreateSchedulingDoctorController } from "../../App/controllers/(admin)/SchedulingDoctorController/CreateSchedulingDoctorController";
import { GETAllSchedulingDoctor } from "../../App/controllers/(admin)/SchedulingDoctorController/GETAllSchedulingDoctor";

const schedulingDoctorRoute: Router = Router();
schedulingDoctorRoute.post("/doctor/scheduling", authMiddleware, privateRoute, new CreateSchedulingDoctorController().handle)
schedulingDoctorRoute.get("/doctor/scheduling/findall", authMiddleware, privateRoute, new GETAllSchedulingDoctor().handle)

export { schedulingDoctorRoute };

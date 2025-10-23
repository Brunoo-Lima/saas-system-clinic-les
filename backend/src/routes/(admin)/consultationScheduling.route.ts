import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateSchedulingController } from '../../App/controllers/(admin)/ConsultationSchedulingController/CreateSchedulingController';
import { FindAllSchedulingController } from '../../App/controllers/(admin)/ConsultationSchedulingController/FindAllSchedulingController';
import { PatchSchedulingController } from '../../App/controllers/(admin)/ConsultationSchedulingController/PatchSchedulingController';
import { DispatchEmailsToSchedulingController } from '../../App/controllers/(admin)/ConsultationSchedulingController/DispatchEmailsToSchedulingController';
import { autCronMiddleware } from '../../App/middlewares/authCronMiddleware';

const schedulingRoutes: Router = Router();

schedulingRoutes.post('/scheduling', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new CreateSchedulingController();
  return createClinicController.handle(req, res, next);
});

schedulingRoutes.get("/scheduling/findall", authMiddleware, privateRoute, new FindAllSchedulingController().handle)
schedulingRoutes.patch("/scheduling", authMiddleware, privateRoute, new PatchSchedulingController().handle)
schedulingRoutes.post("/scheduling/confirm", autCronMiddleware, new DispatchEmailsToSchedulingController().handle)

export { schedulingRoutes };

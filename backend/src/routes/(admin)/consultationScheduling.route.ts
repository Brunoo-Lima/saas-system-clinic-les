import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateSchedulingController } from '../../App/controllers/(admin)/ConsultationSchedulingController/CreateSchedulingController';

const schedulingRoutes: Router = Router();

schedulingRoutes.post('/scheduling', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new CreateSchedulingController();
  return createClinicController.handle(req, res, next);
});


export { schedulingRoutes };

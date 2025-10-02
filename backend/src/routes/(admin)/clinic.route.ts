import { Router } from 'express';
import { CreateClinicController } from '../../App/controllers/(admin)/ClinicController/CreateClinicController';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

const ClinicRoutes: Router = Router();

ClinicRoutes.post('/clinic', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new CreateClinicController();
  return createClinicController.handle(req, res, next);
});

export { ClinicRoutes };

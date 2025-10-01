import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateDoctorController } from '../../App/controllers/(admin)/DoctorController/CreateDoctorController';

const DoctorRoutes: Router = Router();

DoctorRoutes.post('/doctor', authMiddleware, privateRoute, (req, res, next) => {
  const createDoctorController = new CreateDoctorController();
  return createDoctorController.handle(req, res, next);
});

export { DoctorRoutes };

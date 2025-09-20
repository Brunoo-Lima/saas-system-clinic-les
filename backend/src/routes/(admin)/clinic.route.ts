import { Router } from 'express';
import { CreateClinicController } from '../../controllers/(admin)/Clinic/CreateClinicController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { privateRoute } from '../../middlewares/privateRoute';

const ClinicRoutes: Router = Router();

ClinicRoutes.post(
  '/clinic',
  authMiddleware,
  privateRoute,
  new CreateClinicController().handle,
);

export { ClinicRoutes };

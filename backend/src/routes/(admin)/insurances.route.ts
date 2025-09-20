import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { privateRoute } from '../../middlewares/privateRoute';
import { CreateInsuranceController } from '../../controllers/(admin)/InsuranceController/CreateInsuranceController';
import { FindInsuranceController } from '../../controllers/(admin)/InsuranceController/FindInsuranceController';

const insuranceRoutes: Router = Router();

insuranceRoutes.post(
  '/insurance',
  authMiddleware,
  privateRoute,
  new CreateInsuranceController().handle,
);
insuranceRoutes.post(
  '/insurances/find',
  authMiddleware,
  privateRoute,
  new FindInsuranceController().handle,
);

export { insuranceRoutes };

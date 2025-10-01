import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreateInsuranceController } from '../../App/controllers/(admin)/InsuranceController/CreateInsuranceController';
import { FindInsuranceController } from '../../App/controllers/(admin)/InsuranceController/FindInsuranceController';

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

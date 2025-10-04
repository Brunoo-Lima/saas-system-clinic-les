import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreateInsuranceController } from '../../App/controllers/(admin)/InsuranceController/CreateInsuranceController';
import { FindInsuranceController } from '../../App/controllers/(admin)/InsuranceController/FindInsuranceController';
import { FindAllInsuranceController } from '../../App/controllers/(admin)/InsuranceController/FindAllInsurancesController';

const insuranceRoutes: Router = Router();

insuranceRoutes.post(
  '/insurance',
  authMiddleware,
  privateRoute,
  new CreateInsuranceController().handle,
);
insuranceRoutes.post(
  '/insurance/find',
  authMiddleware,
  privateRoute,
  new FindInsuranceController().handle,
);

insuranceRoutes.get(
  '/insurance/findall',
  authMiddleware,
  privateRoute,
  new FindAllInsuranceController().handle,
);

export { insuranceRoutes };

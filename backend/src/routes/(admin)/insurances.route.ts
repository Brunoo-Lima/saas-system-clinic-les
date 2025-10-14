import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateInsuranceController } from '../../App/controllers/(admin)/InsuranceController/CreateInsuranceController';
import { FindInsuranceController } from '../../App/controllers/(admin)/InsuranceController/FindInsuranceController';
import { FindAllInsuranceController } from '../../App/controllers/(admin)/InsuranceController/FindAllInsurancesController';
import { PatchInsuranceController } from '../../App/controllers/(admin)/InsuranceController/PatchInsuranceController';
import { AddInsuranceToSpecialtyController } from '../../App/controllers/(admin)/InsuranceController/InsuranceToRelationsController/AddInsuranceToSpecialtyController';
import { AddInsuranceToModalityController } from '../../App/controllers/(admin)/InsuranceController/InsuranceToRelationsController/AddInsuranceToModalityController';

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

insuranceRoutes.patch(
  '/insurance',
  authMiddleware,
  privateRoute,
  new PatchInsuranceController().handle
)

insuranceRoutes.post(
  '/insurance/specialties/add',
  authMiddleware,
  privateRoute,
  new AddInsuranceToSpecialtyController().handle
)

insuranceRoutes.post(
  '/insurance/modalities/add',
  authMiddleware,
  privateRoute,
  new AddInsuranceToModalityController().handle
)

export { insuranceRoutes };

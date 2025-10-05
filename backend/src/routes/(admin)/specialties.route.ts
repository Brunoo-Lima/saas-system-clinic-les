import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreateSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/CreateSpecialtiesController';
import { FindSpecialtyController } from '../../App/controllers/(admin)/SpecialtiesController/FindSpecialtiesController';
import { GetSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/GetSpecialtiesController';
import { UpdateSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/UpdateSpecialtiesController';

const specialtyRoutes: Router = Router();
specialtyRoutes.post(
  '/specialty',
  authMiddleware,
  privateRoute,
  new CreateSpecialtiesController().handle,
);
specialtyRoutes.post(
  '/specialty/find',
  authMiddleware,
  privateRoute,
  new FindSpecialtyController().handle,
);

specialtyRoutes.put('/specialty', authMiddleware, privateRoute, new UpdateSpecialtiesController().handle)
specialtyRoutes.get(
  '/specialty/findall',
  authMiddleware,
  privateRoute,
  new GetSpecialtiesController().handle
)

export { specialtyRoutes };

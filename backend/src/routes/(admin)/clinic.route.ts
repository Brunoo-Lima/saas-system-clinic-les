import { Router } from 'express';
import { CreateClinicController } from '../../App/controllers/(admin)/ClinicController/CreateClinicController';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { FindClinicController } from '../../App/controllers/(admin)/ClinicController/FindClinicController';
import { FindAllClinicController } from '../../App/controllers/(admin)/ClinicController/FindAllClinicController';
import { PatchClinicController } from '../../App/controllers/(admin)/ClinicController/PatchClinicController';
import { CreateSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/CreateSpecialtiesController';
import { FindSpecialtyController } from '../../App/controllers/(admin)/SpecialtiesController/FindSpecialtiesController';
import { GetSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/GetSpecialtiesController';
import { UpdateSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/UpdateSpecialtiesController';
import { DeleteSpecialtiesController } from '../../App/controllers/(admin)/SpecialtiesController/DeleteSpecialtiesController';

const ClinicRoutes: Router = Router();

ClinicRoutes.post('/clinic', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new CreateClinicController();
  return createClinicController.handle(req, res, next);
});

ClinicRoutes.post("/clinic/find", authMiddleware, privateRoute, new FindClinicController().handle)
ClinicRoutes.get('/clinic/findall', authMiddleware, privateRoute, new FindAllClinicController().handle)
ClinicRoutes.patch('/clinic', authMiddleware, privateRoute, new PatchClinicController().handle)

ClinicRoutes.post(
  '/clinic/:id/specialty',
  authMiddleware,
  privateRoute,
  new CreateSpecialtiesController().handle,
);
ClinicRoutes.post(
  '/clinic/:id/specialty/find',
  authMiddleware,
  privateRoute,
  new FindSpecialtyController().handle,
);

ClinicRoutes.put('/specialty', authMiddleware, privateRoute, new UpdateSpecialtiesController().handle)
ClinicRoutes.delete('/specialty', authMiddleware, privateRoute, new DeleteSpecialtiesController().handle)
ClinicRoutes.get('/clinic/:id/specialty/findall', authMiddleware, privateRoute, new GetSpecialtiesController().handle)

export { ClinicRoutes };

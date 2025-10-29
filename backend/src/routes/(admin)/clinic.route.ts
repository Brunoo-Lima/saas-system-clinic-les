import { Router } from 'express';
import { CreateClinicController } from '../../App/controllers/(admin)/ClinicController/CreateClinicController';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { FindClinicController } from '../../App/controllers/(admin)/ClinicController/FindClinicController';
import { FindAllClinicController } from '../../App/controllers/(admin)/ClinicController/FindAllClinicController';
import { PatchClinicController } from '../../App/controllers/(admin)/ClinicController/PatchClinicController';

const ClinicRoutes: Router = Router();

ClinicRoutes.post('/clinic', authMiddleware, privateRoute, (req, res, next) => {
  const createClinicController = new CreateClinicController();
  return createClinicController.handle(req, res, next);
});

ClinicRoutes.post("/clinic/find", authMiddleware, privateRoute, new FindClinicController().handle)
ClinicRoutes.get('/clinic/findall', authMiddleware, privateRoute, new FindAllClinicController().handle)
ClinicRoutes.patch('/clinic', authMiddleware, privateRoute, new PatchClinicController().handle)

export { ClinicRoutes };

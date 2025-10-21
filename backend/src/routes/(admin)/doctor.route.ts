import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateDoctorController } from '../../App/controllers/(admin)/DoctorController/CreateDoctorController';
import { FindDoctorController } from '../../App/controllers/(admin)/DoctorController/FindDoctorController';
import { FindAllDoctorController } from '../../App/controllers/(admin)/DoctorController/FindAllDoctorsController';
import { PatchDoctorController } from '../../App/controllers/(admin)/DoctorController/PatchDoctorController';

const DoctorRoutes: Router = Router();

DoctorRoutes.post('/doctor', authMiddleware, privateRoute, (req, res, next) => {
  const createDoctorController = new CreateDoctorController();
  return createDoctorController.handle(req, res, next);
});

DoctorRoutes.post('/doctor/find', authMiddleware, privateRoute, new FindDoctorController().handle)
DoctorRoutes.get('/doctor/findall', authMiddleware, privateRoute, new FindAllDoctorController().handle)
DoctorRoutes.patch('/doctor', authMiddleware, privateRoute, new PatchDoctorController().handle)

export { DoctorRoutes };

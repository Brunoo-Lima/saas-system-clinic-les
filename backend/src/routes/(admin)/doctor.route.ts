import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';
import { CreateDoctorController } from '../../App/controllers/(admin)/DoctorController/CreateDoctorController';
import { FindDoctorController } from '../../App/controllers/(admin)/DoctorController/FindDoctorController';
import { FindAllDoctorController } from '../../App/controllers/(admin)/DoctorController/FindAllDoctorsController';
import { PatchDoctorController } from '../../App/controllers/(admin)/DoctorController/PatchDoctorController';
import { AddSpecialtiesToDoctorController } from '../../App/controllers/(admin)/DoctorController/DoctorToRelationsController/AddSpecialtiesToDoctorController';
import { AddPeriodsToDoctorController } from '../../App/controllers/(admin)/DoctorController/DoctorToRelationsController/AddPeriodsToDoctorController';
import { FindAllFinancialToDoctorController } from '../../App/controllers/(admin)/DoctorController/FindAllFinancialToDoctorController';

const DoctorRoutes: Router = Router();

DoctorRoutes.post('/doctor', authMiddleware, privateRoute, (req, res, next) => {
  const createDoctorController = new CreateDoctorController();
  return createDoctorController.handle(req, res, next);
});

DoctorRoutes.post('/doctor/find', authMiddleware, privateRoute, new FindDoctorController().handle)
DoctorRoutes.get('/doctor/findall', authMiddleware, new FindAllDoctorController().handle)
DoctorRoutes.patch('/doctor', authMiddleware, privateRoute, new PatchDoctorController().handle)
DoctorRoutes.post('/doctor/specialties/add', authMiddleware, privateRoute, new AddSpecialtiesToDoctorController().handle)
DoctorRoutes.post('/doctor/periods/add', authMiddleware, privateRoute, new AddPeriodsToDoctorController().handle)
DoctorRoutes.get('/doctor/:id/financial', authMiddleware, new FindAllFinancialToDoctorController().handle)

export { DoctorRoutes };

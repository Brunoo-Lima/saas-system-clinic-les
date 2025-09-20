import { Router } from 'express';
import { CreateClinicController } from '../../controllers/public/Clinic/CreateClinicController';

const ClinicRoutes: Router = Router();

ClinicRoutes.post('/clinic', (req, res, next) => {
  const createClinicController = new CreateClinicController();
  return createClinicController.handle(req, res, next);
});

export { ClinicRoutes };

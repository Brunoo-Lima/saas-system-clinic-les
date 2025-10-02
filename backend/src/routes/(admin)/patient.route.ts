import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreatePatientController } from '../../App/controllers/(admin)/PatientController.ts/CreatePatientController';

const patientRoutes: Router = Router();

patientRoutes.post(
  '/patient',
  authMiddleware,
  privateRoute,
  new CreatePatientController().handle,
);

export { patientRoutes };

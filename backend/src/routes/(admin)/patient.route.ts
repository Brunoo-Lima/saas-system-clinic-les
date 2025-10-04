import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreatePatientController } from '../../App/controllers/(admin)/PatientController.ts/CreatePatientController';
import { VinculateCardInsuranceController } from '../../App/controllers/(admin)/PatientController.ts/VinculateCardInsuranceController';

const patientRoutes: Router = Router();

patientRoutes.post(
  '/patient',
  authMiddleware,
  privateRoute,
  new CreatePatientController().handle,
);

patientRoutes.put('/patient/card_insurance/vinculate', authMiddleware, privateRoute, new VinculateCardInsuranceController().handle)
export { patientRoutes };

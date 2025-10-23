import { Router } from 'express';
import { authMiddleware } from '../../App/middlewares/authMiddleware';
import { privateRoute } from '../../App/middlewares/privateRoute';

import { CreatePatientController } from '../../App/controllers/(admin)/PatientController.ts/CreatePatientController';
import { VinculateCardInsuranceController } from '../../App/controllers/(admin)/PatientController.ts/VinculateCardInsuranceController';
import { FindAllPatientController } from '../../App/controllers/(admin)/PatientController.ts/FindAllPatientController';
import { PatchPatientController } from '../../App/controllers/(admin)/PatientController.ts/PatchPatientController';

const patientRoutes: Router = Router();

patientRoutes.post('/patient', authMiddleware, privateRoute, new CreatePatientController().handle );
patientRoutes.post('/patient/card_insurance/add', authMiddleware, privateRoute, new VinculateCardInsuranceController().handle)
patientRoutes.get('/patient/findall', authMiddleware, privateRoute, new FindAllPatientController().handle)
patientRoutes.patch('/patient', authMiddleware, privateRoute, new PatchPatientController().handle)

export { patientRoutes };

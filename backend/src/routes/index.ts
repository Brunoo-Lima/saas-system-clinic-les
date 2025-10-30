import express, { Router } from 'express';
import { authRoutes } from './auth.route';
import { insuranceRoutes } from './(admin)/insurances.route';
import { patientRoutes } from './(admin)/patient.route';
import { ClinicRoutes } from './(admin)/clinic.route';
import { ModalityRoutes } from './(admin)/modality.route';
import { DoctorRoutes } from './(admin)/doctor.route';
import { userRoutes } from './user.route';
import { userPrivateRoutes } from './(admin)/user.private.routes';
import {schedulingDoctorRoute} from './(admin)/schedulingDoctor.route';
import { schedulingRoutes } from './(admin)/consultationScheduling.route';
import { financialRoute } from './(admin)/financial.route';

const routes: Router = express.Router();

routes.use(authRoutes);
routes.use(insuranceRoutes);
routes.use(patientRoutes);
routes.use(ClinicRoutes);
routes.use(ModalityRoutes);
routes.use(DoctorRoutes);
routes.use(userRoutes);
routes.use(userPrivateRoutes);
routes.use(schedulingDoctorRoute);
routes.use(schedulingRoutes);
routes.use(financialRoute);

export { routes };

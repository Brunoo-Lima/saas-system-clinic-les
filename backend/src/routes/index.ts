import express, { Router } from 'express';
import { authRoutes } from './auth.route';
import { specialtyRoutes } from './(admin)/specialties.route';
import { insuranceRoutes } from './(admin)/insurances.route';
import { patientRoutes } from './(admin)/patient.route';
import { ClinicRoutes } from './(admin)/clinic.route';
import { ModalityRoutes } from './(admin)/modality.route';
import { DoctorRoutes } from './(admin)/doctor.route';
import { userRoutes } from './user.route';
import { userPrivateRoutes } from './(admin)/user.private.routes';
const routes: Router = express.Router();

routes.use(authRoutes);
routes.use(specialtyRoutes);
routes.use(insuranceRoutes);
routes.use(patientRoutes);
routes.use(ClinicRoutes);
routes.use(ModalityRoutes);
routes.use(DoctorRoutes);
routes.use(userRoutes);
routes.use(userPrivateRoutes);

export { routes };

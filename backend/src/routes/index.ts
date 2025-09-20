import express, { Router } from 'express';
import { userRoutes } from './user.route';
import { authRoutes } from './auth.route';
import { specialtyRoutes } from './(admin)/specialties.route';
import { insuranceRoutes } from './(admin)/insurances.route';
import { patientRoutes } from './(admin)/patient.route';
import { ClinicRoutes } from './(admin)/clinic.route';

const routes: Router = express.Router();

routes.use(userRoutes);
routes.use(authRoutes);
routes.use(specialtyRoutes);
routes.use(insuranceRoutes);
routes.use(patientRoutes);
routes.use(ClinicRoutes);

export { routes };

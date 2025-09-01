import express, { Router } from "express";
import { userRoutes } from "./createUser.route";
import { authRoutes } from "./auth.route";
import { specialtyRoutes } from "./(admin)/specialtiesRoute.route";

const routes: Router = express.Router();

// routes.use(userRoutes);

routes.use(userRoutes);
routes.use(authRoutes);
routes.use(specialtyRoutes);

export { routes };

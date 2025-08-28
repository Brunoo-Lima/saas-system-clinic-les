import express, { Router } from "express";
import { userRoutes } from "./createUser.route";
import { authRoutes } from "./auth.route";

const routes: Router = express.Router();

// routes.use(userRoutes);

routes.use(userRoutes);
routes.use(authRoutes);

export { routes };

import express, { Router } from "express";
import { userRoutes } from "./createUser.route";

const routes: Router = express.Router();

// routes.use(userRoutes);

routes.use(userRoutes);

export { routes };

import express, { Router } from "express";
import { testeRoute } from "./teste.route";

const routes: Router = express.Router();

// routes.use(userRoutes);

routes.use(testeRoute);

export { routes };

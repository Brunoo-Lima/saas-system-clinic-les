import express, { Application } from "express";
import cors from "cors";
import { routes } from "./routes";
import { swaggerUiServe, swaggerUiSetup } from "./utils/swagger";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);

app.use(routes);

// app.use(errorHandler as any);

export default app;

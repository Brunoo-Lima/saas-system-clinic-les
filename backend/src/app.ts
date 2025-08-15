import express, { Application } from 'express';
// import 'express-async-errors';
import cors from 'cors';
// import errorHandler from './utils/error/error-handler';
import { routes } from './routes';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use(routes);

// app.use(errorHandler as any);

export default app;

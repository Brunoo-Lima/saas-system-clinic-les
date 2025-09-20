import { Router } from 'express';
import { AuthController } from '../controllers/public/AuthController/AuthController';

const authRoutes: Router = Router();
authRoutes.post('/auth', new AuthController().handle);

export { authRoutes };

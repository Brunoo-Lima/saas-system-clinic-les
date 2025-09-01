import {Router} from 'express';
import { AuthController } from '../controllers/AuthController/AuthController';

const authRoutes: Router = Router();
authRoutes.post('/auth', new AuthController().handle);

export { authRoutes };
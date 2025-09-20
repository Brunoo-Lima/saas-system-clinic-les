import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { privateRoute } from '../middlewares/privateRoute';
import { FindUserController } from '../controllers/(admin)/UserController/FindUsersController';

const userRoutes: Router = Router();

userRoutes.post(
  '/user/find',
  authMiddleware,
  privateRoute,
  new FindUserController().handle,
);

export { userRoutes };

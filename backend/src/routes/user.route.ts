import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { privateRoute } from '../middlewares/privateRoute';
import { FindUserController } from '../controllers/(admin)/UserController/FindUsersController';
import { CreateUserController } from '../controllers/(admin)/UserController/CreateUserController';

const userRoutes: Router = Router();

userRoutes.post('/user', new CreateUserController().handle);

userRoutes.post(
  '/user/find',
  authMiddleware,
  privateRoute,
  new FindUserController().handle,
);

export { userRoutes };

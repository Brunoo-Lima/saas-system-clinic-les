import 'dotenv/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserBuilder } from '../../../../domain/entities/EntityUser/UserBuilder';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import { FindUserService } from '../../../services/(admin)/User/FindUserService';

export class AuthController {
  async handle(req: Request, res: Response) {
    try {
      const userData = req.body;
      const userDomain = new UserBuilder()
        .setEmail(userData.email)
        .setPassword(userData.password)
        .setRole(userData.role)
        .build();

      const userService = new FindUserService();
      const userExists = await userService.execute(userDomain);
      
      if (!userExists.success || userExists.data.password !== userDomain.password) {
        return res.status(400).json(ResponseHandler.error('User not found'));
      }
      if (userExists.data?.role && userExists.data.role !== userDomain.role) {
        return res
          .status(400)
          .json(ResponseHandler.error('The role invalid to this user !'));
      }
      const token = jwt.sign(userExists.data, process.env.SECRET_KEY!, {
        expiresIn: '1d',
      });
      return res
        .status(200)
        .json(ResponseHandler.success({ token }, 'Authentication successful'));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseHandler.error('Internal server error.', error));
    }
  }
}

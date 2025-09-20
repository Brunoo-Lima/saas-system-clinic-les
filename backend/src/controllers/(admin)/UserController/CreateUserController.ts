import { Request, Response } from 'express';
import { ResponseHandler } from '../../../helpers/ResponseHandler';
import { UserBuilder } from '../../../domain/entities/EntityUser/UserBuilder';
import { CreateUserService } from '../../../services/(admin)/User/CreateUserService';

export class CreateUserController {
  async handle(req: Request, res: Response) {
    try {
      const userData = req.body;
      if (!userData)
        return res.status(400).json(ResponseHandler.error('Data not sent'));

      const userDomain = new UserBuilder()
        .setEmail(userData.email)
        .setPassword(userData.password)
        .setRole(userData.role)
        .setAvatar(userData.avatar)
        .setEmailVerified(userData.emailVerified)
        .build();

      const service = new CreateUserService();

      const user = await service.execute(userDomain);

      return res.status(200).json(user);
    } catch (e) {
      return res
        .status(500)
        .json(ResponseHandler.error('Internal server error'));
    }
  }
}

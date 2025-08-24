import { Request, Response } from 'express';
import { UserDTO } from '../../infrastructure/dto/userDTO';
import { UserBuilder } from '../../domain/entities/User/UserBuilder';
import { CreateUserService } from '../../services/UserService/CreateUserService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository/UserRepository';
import { ResponseHandler } from '../../helpers/ResponseHandler';

export class CreateUserController {
    async handle(req: Request, res: Response): Promise<Response> {
        try {
            const userData = req.body as UserDTO;
            const userDomain = new UserBuilder()
                .setEmail(userData.email!)
                .setPassword(userData.password!)
                .setRole(userData.role || 'user')
                .setAvatar(userData.avatar || '')
                .setEmailVellicated(false)
                .build();
 
            const userService = new CreateUserService(new UserRepository());
            const newUser = await userService.execute(userDomain);
            if(!newUser.success){ return res.status(400).json(newUser); }

            return res.status(201).json(newUser);

        } catch (error) {
            return res.status(500).json(ResponseHandler.error("Internal server error.", error));
        }
    }
}
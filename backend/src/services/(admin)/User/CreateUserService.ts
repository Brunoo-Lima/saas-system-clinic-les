import { User } from '../../../domain/entities/EntityUser/User';

import { ResponseHandler } from '../../../helpers/ResponseHandler';
import { IUserRepository } from '../../../infrastructure/database/repositories/UserRepository/IUserRepository';
import { UserRepository } from '../../../infrastructure/database/repositories/UserRepository/UserRepository';

export class CreateUserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(user: User) {
    try {
      return await this.userRepository.createUser(user);
    } catch (error) {
      return ResponseHandler.error(['Failed to create user in repository']);
    }
  }
}

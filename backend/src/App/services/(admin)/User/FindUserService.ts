import { User } from "../../../../domain/entities/EntityUser/User";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";

export class FindUserService {
  private userRepository: IRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }
  public async execute(user: User) {
    try {
      if (!user.email) {
        return ResponseHandler.error("Email is required to find a user");
      }

      const foundUser = await this.userRepository.findEntity(user);
      if (!foundUser) {
        return ResponseHandler.error("User not found");
      }
      return ResponseHandler.success(foundUser, "User found successfully");
    } catch (error) {
      return ResponseHandler.error("Failed to find user")
    }
  }
}


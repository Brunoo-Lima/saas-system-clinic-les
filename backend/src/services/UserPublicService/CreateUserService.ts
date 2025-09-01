import { IUserRepository } from "../../infrastructure/repositories/UserRepository/IUserRepository";
import { User } from "../../domain/entities/EntityUser/User";
import { ValidatorController } from "../../domain/validators/ValidatorController";
import { ValidatorEmail } from "../../domain/validators/UserValidator/ValidatorEmail";
import { RequiredDataToUserCreate } from "../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ResponseHandler } from "../../helpers/ResponseHandler";
import { UserRepository } from "../../infrastructure/repositories/UserRepository/UserRepository";
import { ValidatorUserExists } from "../../domain/validators/UserValidator/ValidatorUserExists";
import { UserDTO } from "../../infrastructure/dto/userDTO";
import { UserBuilder } from "../../domain/entities/EntityUser/UserBuilder";

export class CreateUserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData: UserDTO) {
    try {
      const userDomain = new UserBuilder()
        .setEmail(userData.email)
        .setPassword(userData.password)
        .setRole(userData.role)
        .setAvatar(userData.avatar || "")
        .setEmailVerified(userData.emailVerified || false)
        .build();
      const validatorController = new ValidatorController(
        `C-${userDomain.constructor.name}`
      );

      validatorController.setValidator(`C-${userDomain.constructor.name}`, [
        new ValidatorEmail(),
        new RequiredDataToUserCreate(),
        new ValidatorUserExists()
      ]);

      const userDataIsValid = await validatorController.process(userDomain, this.userRepository);
      if (!userDataIsValid.success) return userDataIsValid;

      const newUser = await this.userRepository.createUser(userDomain);
      return newUser;

    } catch (error) {
      return ResponseHandler.error("Failed to create user", [
        (error as Error).message,
      ]);
    }
  }
}

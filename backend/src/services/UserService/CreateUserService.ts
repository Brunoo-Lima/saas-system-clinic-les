import { IUserRepository } from "../../infrastructure/repositories/UserRepository/IUserRepository";
import { User } from "../../domain/entities/User/User";
import { ValidatorController } from "../../domain/validators/ValidatorController";
import { ValidatorEmail } from "../../domain/validators/ValidatorEmail";
import { RequiredDataToUserCreate } from "../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ResponseHandler } from "../../helpers/ResponseHandler";
import { UserRepository } from "../../infrastructure/repositories/UserRepository/UserRepository";
import { ValidatorUserExists } from "../../domain/validators/ValidatorUserExists";

export class CreateUserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async execute(userData: User) {
    try {
      const validatorController = new ValidatorController(
        userData.constructor.name
      );
      validatorController.setValidator(userData.constructor.name, [
        new ValidatorEmail(),
        new RequiredDataToUserCreate(),
        new ValidatorUserExists()
      ]);

      const userDataIsValid = await validatorController.process(userData, this.userRepository);
      if (!userDataIsValid.success) return userDataIsValid;

      const newUser = await this.userRepository.createUser(userData);
      return newUser;

    } catch (error) {
      return ResponseHandler.error("Failed to create user", [
        (error as Error).message,
      ]);
    }
  }
}

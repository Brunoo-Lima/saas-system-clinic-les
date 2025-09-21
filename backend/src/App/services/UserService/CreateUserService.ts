import { UserBuilder } from "../../../domain/entities/EntityUser/UserBuilder";
import { RequiredDataToUserCreate } from "../../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ValidatorEmail } from "../../../domain/validators/UserValidator/ValidatorEmail";
import { ValidatorUserExists } from "../../../domain/validators/UserValidator/ValidatorUserExists";
import { ValidatorController } from "../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IUserRepository } from "../../../infrastructure/database/repositories/UserRepository/IUserRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { UserDTO } from "../../../infrastructure/dto/UserDTO";
import Queue from "../../../infrastructure/queue/Queue";

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
            const validatorController = new ValidatorController();

            validatorController.setValidator(`C-${userDomain.constructor.name}`, [
                new ValidatorEmail(),
                new RequiredDataToUserCreate(),
                new ValidatorUserExists()
            ]);

            const userDataIsValid = await validatorController.process(`C-${userDomain.constructor.name}`, userDomain, this.userRepository);
            if (!userDataIsValid.success) return userDataIsValid;

            const newUser = await this.userRepository.createUser(userDomain);
            await Queue.publish(newUser.data);

            return newUser;

        } catch (error) {
            return ResponseHandler.error("Failed to create user", [
                (error as Error).message,
            ]);
        }
    }
}
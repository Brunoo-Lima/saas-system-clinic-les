import { UserBuilder } from "../../../domain/entities/EntityUser/UserBuilder";
import { RequiredGeneralData } from "../../../domain/validators/General/RequiredGeneralData";
import { RequiredDataToUserCreate } from "../../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ValidatorEmail } from "../../../domain/validators/UserValidator/ValidatorEmail";
import { ValidatorUserExists } from "../../../domain/validators/UserValidator/ValidatorUserExists";
import { ValidatorController } from "../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { UserDTO } from "../../../infrastructure/DTOs/UserDTO";
import { queueClient } from "../../../infrastructure/queue/queue_email_client";

export class CreateUserService {
    private userRepository: IRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async execute(userData: UserDTO) {
        try {
            const userDomain = new UserBuilder()
                .setEmail(userData.email)
                .setUsername(userData.username)
                .setPassword(userData.password)
                .setRole(userData.role)
                .setAvatar(userData.avatar || "")
                .setProfileCompleted(userData.profileCompleted)
                .setEmailVerified(userData.emailVerified || false)
                .setStatus(true)
                .build();
            const validatorController = new ValidatorController();

            validatorController.setValidator(`C-${userDomain.constructor.name}`, [
                new ValidatorEmail(),
                new RequiredDataToUserCreate(),
                new RequiredGeneralData(Object.keys(userDomain.props), ["avatar"]),
                new ValidatorUserExists()
            ]);

            const userDataIsValid = await validatorController.process(`C-${userDomain.constructor.name}`, userDomain, this.userRepository);
            if (!userDataIsValid.success) return userDataIsValid;

            const newUser = await this.userRepository.create(userDomain);
            const { password, ...userResponse } = newUser.data

            await queueClient.add("welcome_email", newUser.data)
            return ResponseHandler.success(userResponse, "Success ! User was inserted.");

        } catch (error) {
            return ResponseHandler.error("Failed to create user", [
                (error as Error).message,
            ]);
        }
    }
}
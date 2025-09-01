import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IUserRepository } from "../../../infrastructure/repositories/UserRepository/IUserRepository";
import { User } from "../../entities/EntityUser/User";
import { IProcessValidator } from "../IProcessValidator";

export class ValidatorUserExists implements IProcessValidator {

    async valid(user: User, userRepository: IUserRepository) {
        const email = user.email;
        if (!email) { return ResponseHandler.error("Email is required.") }

        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) { return ResponseHandler.error("User with this email already exists.") }

        return ResponseHandler.success(user, "User does not exist.");
    }
}
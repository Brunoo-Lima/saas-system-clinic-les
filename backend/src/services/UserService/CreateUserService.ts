import { IUserRepository } from "../../infrastructure/repositories/UserRepository/IUserRepository";
import { User } from "../../domain/entities/User/User";
import { ValidatorController } from "../../domain/validators/ValidatorController";
import { ValidatorEmail } from "../../domain/validators/ValidatorEmail";
import { RequiredDataToUserCreate } from "../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ResponseHandler } from "../../helpers/ResponseHandler";

export class CreateUserService {
    constructor(private userRepository: IUserRepository) { }

    async execute(userData: User){
        try { 
            const validatorController = new ValidatorController(userData.constructor.name);
            validatorController.setValidator(userData.constructor.name, [
                new ValidatorEmail(),
                new RequiredDataToUserCreate()
            ]);

            const userDataIsValid = await validatorController.process(userData);
            if (!userDataIsValid.success) return userDataIsValid

            const newUser = await this.userRepository.createUser(userData);
            return newUser;
             
        } catch (error) {
            return ResponseHandler.error("Failed to create user", [(error as Error).message]);
       }
    }
}
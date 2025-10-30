import { UserBuilder } from "../../../../domain/entities/EntityUser/UserBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { randomPassword } from "../../../../helpers/randomPassword";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { queuePasswordReset } from "../../../../infrastructure/queue/queue_email_client";

export class UpdatePasswordService {
    private repository: IRepository;
    constructor(){
        this.repository = new UserRepository()
    }
    async execute(id: string) {
        try {
            const userDomain = new UserBuilder()
            .setPassword(randomPassword(8))
            .build()

            userDomain.setUuidHash(id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`U-${userDomain.constructor.name}`, [ new UUIDValidator()])
            
            const userIsValid = await validator.process(`U-${userDomain.constructor.name}`, userDomain)
            if(!userIsValid.success) return userIsValid
            
            const userUpdated = await this.repository.updateEntity(userDomain)
            if(!Array.isArray(userUpdated)) return userUpdated
            const user = userUpdated[0]
            
            if(!userUpdated[0]) return ResponseHandler.error("The user not updated !")
            const {password, ...userOmitted} = user;

            user.template = "reset_password"
            await queuePasswordReset.add("password_reset_email", user)
            
            return ResponseHandler.success(userOmitted, "Success ! Sended new password to user")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { UserBuilder } from "../../../../domain/entities/EntityUser/UserBuilder";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { UserDTO } from "../../../../infrastructure/DTOs/UserDTO";
import { queuePasswordReset } from "../../../../infrastructure/queue/queue_email_client";

export class PatchUserService {
    private repository: IRepository;
    constructor(){
        this.repository = new UserRepository()
    }

    async execute(userDTO: UserDTO) {
        try {
            const userDomain = new UserBuilder()
                .setEmail(userDTO.email)
                .setUsername(userDTO.username)
                .setRole(userDTO.role)
                .setAvatar(userDTO.avatar || "")
                .setProfileCompleted(userDTO.profileCompleted)
                .setEmailVerified(userDTO.emailVerified)
                .setStatus(userDTO.status)
                .build();
            const entityExists = new EntityExits(userDomain)
            const userExists = await entityExists.valid(userDomain, this.repository)
            if(!userExists.success) return userExists

            // Setamos o ID depois pois caso o usuário exista com o email, ele deve gerar erro.
            userDomain.setUuidHash(userDTO.id ?? "")
            const validator = new ValidatorController()
            validator.setValidator(`U-${userDomain.constructor.name}`, [ new UUIDValidator() ])

            const entityIsValid = await validator.process(`U-${userDomain.constructor.name}`, userDomain, this.repository)
            if(!entityIsValid.success) return entityIsValid

            const userUpdated = await this.repository.updateEntity(userDomain)
            if(!Array.isArray(userUpdated)) return userUpdated
            const {
                password,
                role,
                ...userOmitted
            } = userUpdated[0]
            return ResponseHandler.success(userOmitted, "Success ! Data Updated")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
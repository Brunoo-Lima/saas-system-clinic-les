import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Clinic } from "../../entities/EntityClinic/Clinic";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { Patient } from "../../entities/EntityPatient/Patient";
import { EntityExits } from "../General/EntityExits";
import { IProcessValidator } from "../IProcessValidator";

export class UserAlreadyVinculate implements IProcessValidator {
    async valid(entity: Patient | Doctor, repository: IRepository) {
        try {
            const entityExistsValidator = new EntityExits()
            const hasEntity = await entityExistsValidator.valid(entity, repository)
            if(!hasEntity.success && Array.isArray(hasEntity.data) && hasEntity.data.length > 0){
                const users = hasEntity.data[0].users
                if(users.id === entity.user?.getUUIDHash()){ return ResponseHandler.error("User cannot be connected")}
            }
            return ResponseHandler.success(entity, "User can be connected !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
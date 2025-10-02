import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class EntityExistsToInserted implements IProcessValidator {
    async valid(entity: EntityDomain, repository: IRepository){
        try {
            const entityExists = await repository.findEntity(entity)
            if("success" in entityExists && !entityExists.success) return entityExists
            if(Array.isArray(entityExists) && !entityExists.length) return ResponseHandler.error("The clinic cannot be connected because this not exists !")
            return ResponseHandler.success(entityExists, `${entity.constructor.name} exists, you can insert !`)
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
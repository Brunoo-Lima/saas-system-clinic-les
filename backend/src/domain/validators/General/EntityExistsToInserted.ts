import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class EntityExistsToInserted implements IProcessValidator {
    async valid(entity: EntityDomain | Array<EntityDomain>, repository: IRepository){
        try {
            let entityName = entity.constructor.name
            if(Array.isArray(entity) && entity.length > 0 && entity[0] != null) entityName = entity[0].constructor.name
            if(Array.isArray(entity) && entity.length === 0) return ResponseHandler.success(`The ${entityName} is empty.`)
                
            const entityExists = await repository.findEntity(entity)

            if(entityExists === null) return ResponseHandler.error(`The ${entityName} cannot be connected because a item not exists !`)
            if("success" in entityExists && !entityExists.success) return entityExists
            if(Array.isArray(entityExists) && !entityExists.length) return ResponseHandler.error(`The ${entityName} cannot be connected because a item not exists !`)
            return ResponseHandler.success(entityExists, `${entity.constructor.name} exists, you can insert !`)
        
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
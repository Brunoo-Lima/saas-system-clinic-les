import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class EntityExistsToUpdated implements IProcessValidator {
    async valid(entity: EntityDomain | Array<EntityDomain>, repository: IRepository){
        try {
            let entityName = entity.constructor.name
            const entityCopy = Object.create(entity)
            if(Array.isArray(entityCopy)) entityCopy.map((e) => e.setUuidHash(undefined!)) // Apagamos o ID para buscar pelos outros atributos
            if(!Array.isArray(entityCopy)) entityCopy.setUuidHash(undefined!)
            if(Array.isArray(entityCopy) && entityCopy.length > 0 && entityCopy[0] != null) entityName = entityCopy[0].constructor.name

            const entityExists = await repository.findAllEntity(entityCopy)

            if("success" in entityExists && !entityExists.success) return entityExists
            if(Array.isArray(entityExists) && entityExists.length) return ResponseHandler.error(`The ${entityName} cannot be updated because already exists outer entity !`)
            return ResponseHandler.success(entityExists, `${entityCopy.constructor.name} exists, you can updated !`)
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
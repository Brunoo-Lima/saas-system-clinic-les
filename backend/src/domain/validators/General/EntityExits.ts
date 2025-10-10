import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class EntityExits implements IProcessValidator {
    constructor(
        private entityDomain?: EntityDomain,
    ) { }
    async valid(entity: EntityDomain, repository: IRepository) {
        try {
            
            if (!entity && !this.entityDomain) throw new Error("You can send a entity domain to validation !")
            const entityReceived = this.entityDomain ? this.entityDomain : entity
            const entityName = (Array.isArray(entityReceived) && entityReceived.length > 0) ? entityReceived[0].constructor.name : entityReceived.constructor.name

            const entityExists = await repository.findEntity(entityReceived)
            if (!entityExists) { return ResponseHandler.success(`${entityName} can be inserted!`)}
            if ("success" in entityExists && !entityExists.success) { return entityExists }
            if (entityExists.length !== 0) return ResponseHandler.error(`${entityName} already exists in database !`)
            return ResponseHandler.success(entityExists, `${entityName} not found in database, you can inserted !`)

        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
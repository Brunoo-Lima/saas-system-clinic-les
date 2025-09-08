import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class EntityExits implements IProcessValidator {
    constructor(private entityDomain?: EntityDomain) { }
    async valid(entity: EntityDomain, repository: IRepository) {
        try {
            if (!entity && !this.entityDomain) throw new Error("You can send a entity domain to validation !")
            const entityReceived = this.entityDomain ? this.entityDomain : entity
            const entityExists = await repository.findEntity(entityReceived)
            if ("success" in entityExists && !entityExists.success) { return entityExists }
            if (entityExists.length) { return ResponseHandler.error(`${entityReceived.constructor.name}  already exists in database`) }
            return ResponseHandler.success(entityReceived, `${entityReceived.constructor.name} not found in database, you can inserted !`)

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
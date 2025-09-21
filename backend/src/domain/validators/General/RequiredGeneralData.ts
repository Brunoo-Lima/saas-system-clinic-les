import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class RequiredGeneralData implements IProcessValidator {
    constructor(private keys?: string[], private ignoreKeysIfnotExists?: string[]) { }
    valid(entity: EntityDomain | Array<EntityDomain>, _: IRepository,  objectKeys?: string[]): IResponseHandler | Promise<IResponseHandler> {
        const entityValidate = !Array.isArray(entity) ? [entity] : entity
        
        try {
            const keys = objectKeys ? objectKeys : this.keys
            if (!keys) return ResponseHandler.error("You should be only a key to validated")
            if (!keys.length) return ResponseHandler.success(entity, "Does't exists required data.")
            
            for (const ent of entityValidate) {
                for (const k of keys) {
                    if (this.ignoreKeysIfnotExists?.length && k in this.ignoreKeysIfnotExists) { continue }
                    if (!(typeof k as keyof EntityDomain)) return ResponseHandler.error(`This key: ${k} not exists in object ${ent.constructor.name}`)
                    if (!(ent as any)[k]) return ResponseHandler.error(`This key: ${k} is required in ${ent.constructor.name}.`)
                }
            }
            return ResponseHandler.success(entity, "All data is valid !")
        } catch (error) {
            return ResponseHandler.error((error as Error).message)
        }
    }
}

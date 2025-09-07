import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class RequiredGeneralData implements IProcessValidator {
    constructor(private keys?: string[], private ignoreKeysIfnotExists?: string[]) { }
    valid(entity: EntityDomain, objectKeys?: string[]): IResponseHandler | Promise<IResponseHandler> {
        const keys = objectKeys ? objectKeys : this.keys
        if(!keys) return ResponseHandler.error("You should be only a key to validated")
        try {
            if (!keys.length) return ResponseHandler.success(entity, "Does't exists required data.")
            for (const k of keys) {
                if (this.ignoreKeysIfnotExists?.length && k in this.ignoreKeysIfnotExists){ continue }
                if (!(typeof k as keyof EntityDomain)) return ResponseHandler.error(`This key: ${k} not exists in object`)
                if (!(entity as any)[k]) return ResponseHandler.error(`This key: ${k} is required.`)
            }
            return ResponseHandler.success(entity, "All data is valid !")
        } catch (error) {
            return ResponseHandler.error((error as Error).message)
        }
    }
}

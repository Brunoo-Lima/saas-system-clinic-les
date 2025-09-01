import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class RequiredGeneralData implements IProcessValidator {
    constructor(private keys: string[]) { }
    valid(entity: EntityDomain): IResponseHandler | Promise<IResponseHandler> {
        try {
            if (!this.keys.length) return ResponseHandler.success(entity, "Does't exists required data.")
            for (const k of this.keys) {

                if (!(typeof k as keyof EntityDomain)) return ResponseHandler.error(`This key: ${k} not exists in object`)
                if (!(entity as any)[k]) return ResponseHandler.error([`This key: ${k} is required.`])
            }
            return ResponseHandler.success(entity, "All data is valid !")
        } catch (error) {
            return ResponseHandler.error((error as Error).message)
        }
    }
}
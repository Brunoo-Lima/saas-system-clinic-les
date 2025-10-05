import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { EntityDomain } from "../../entities/EntityDomain";
import { IProcessValidator } from "../IProcessValidator";

export class UUIDValidator implements IProcessValidator {
    valid(entities: EntityDomain | Array<EntityDomain>){
        try {
            const regex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
            if(Array.isArray(entities)){
                for(const entity of entities){
                    if(!regex.test(entity.getUUIDHash())) { return ResponseHandler.error(`The ID of ${entity.constructor.name} is invalid !`)}
                }
                return ResponseHandler.success(entities, "The entities is valid !")
            }
            if(!regex.test(entities.getUUIDHash())) { return ResponseHandler.error(`The ID of ${entities.constructor.name} is invalid !`)}
            return ResponseHandler.success(entities, "The id is valid !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
    
}
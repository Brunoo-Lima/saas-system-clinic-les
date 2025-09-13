import { ResponseHandler } from "../../helpers/ResponseHandler";
import { EntityDomain } from "../entities/EntityDomain";
import { IProcessValidator } from "./IProcessValidator";

export class ValidatorController {
    private validatorsClasses = new Map<string, IProcessValidator[]>();
    public async process(className: string, entity: EntityDomain | Array<EntityDomain>, ...args: any){

        const validators = this.validatorsClasses.get(className);
        if(!validators) return { success: true, message: "No validators to process"};
        
        const results = await Promise.all(validators.map(validator => validator.valid(entity, ...args)));
        const fails = results.filter(r => !r.success);

        if(fails.length > 0){
            const messages = fails.map(f => Array.isArray(f.message) ? f.message[0] : f.message)
            return ResponseHandler.error(messages)
        }
        return ResponseHandler.success(results, "All validations passed");
    }

    public setValidator(className: string, validator: IProcessValidator | IProcessValidator[]) {
        
        if(!this.validatorsClasses.has(className)){
            this.validatorsClasses.set(className, []);
        }
        const validators = this.validatorsClasses.get(className);
        Array.isArray(validator) ? validators?.push(...validator) :  validators?.push(validator);
        this.validatorsClasses.set(className, validators!);
        return this;
    }
}
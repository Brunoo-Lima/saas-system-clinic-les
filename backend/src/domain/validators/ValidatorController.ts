import { EntityDomain } from "../entities/EntityDomain";
import { IProcessValidator } from "./IProcessValidator";

export class ValidatorController {
    private validatorsClasses = new Map<string, IProcessValidator[]>();
    private className: string;

    constructor(className: string) {
        this.className = className;
        this.validatorsClasses.set(className, []);
    }
    public async process(entity: EntityDomain, {...args} = {}){

        const validators = this.validatorsClasses.get(this.className);
        if(!validators) return { success: true, message: "No validators to process"};
        
        const results = await Promise.all(validators.map(validator => validator.valid(entity, args)));
        const fails = results.filter(r => !r.success);

        if(fails.length > 0){
            return { success: false, message: fails.map(f => f.message)};
        }
        return { success: true, message: "All validations passed" };
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
import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { DateSchedulingValidator } from "../../../../domain/validators/ConsultationScheduling/DatesSchedulingValidator";
import { ExistsScheduling } from "../../../../domain/validators/ConsultationScheduling/ExistsScheduling";
import { StatusValidationToUpdated } from "../../../../domain/validators/ConsultationScheduling/StatusValidationToUpdate";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { IProcessValidator } from "../../../../domain/validators/IProcessValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";

export class PatchSchedulingService {
    private repository: IRepository;

    constructor(){
        this.repository = new ConsultationSchedulingRepository();
    }
    async execute(schedulingDTO: ConsultationSchedulingDTO, id: string | undefined){
        try {
            const schedulingDomain = SchedulingFactory.createFromDTO(schedulingDTO)

            schedulingDomain.setUuidHash(id ?? "")
            const validator = new ValidatorController()
            const allValidators: Array<IProcessValidator> = [ new UUIDValidator(), new StatusValidationToUpdated()]
            if(schedulingDTO.date){
                allValidators.push(
                    new DateSchedulingValidator(),
                    new ExistsScheduling()
                )                    
            }
        
            const schedulingIsValid = await validator.process(`U-${schedulingDomain.constructor.name}`, schedulingDomain)
            if(!schedulingIsValid.success) return schedulingIsValid
            
            const schedulingUpdated = await this.repository.updateEntity(schedulingDomain,)
            if(!Array.isArray(schedulingUpdated)) return schedulingUpdated

            return ResponseHandler.success(schedulingUpdated, "Success ! Scheduling updated.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
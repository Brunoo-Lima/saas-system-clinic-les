import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";

export class PatchSchedulingService {
    async execute(schedulingDTO: ConsultationSchedulingDTO, id: string | undefined){
        try {
            const schedulingDomain = SchedulingFactory.createFromDTO(schedulingDTO)
            const validator = new ValidatorController()
            
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
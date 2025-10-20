import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { StatusValidationToUpdated } from "../../../../domain/validators/ConsultationScheduling/StatusValidationToUpdate";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";

export class PatchSchedulingService {
    async execute(schedulingDTO: ConsultationSchedulingDTO, id: string | undefined){
        try {
            const schedulingDomain = SchedulingFactory.createFromDTO(schedulingDTO)
            schedulingDomain.setUuidHash(id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`U-${schedulingDomain.constructor.name}`, [
                new StatusValidationToUpdated()
            ])
            const schedulingIsValid = await validator.process(`U-${schedulingDomain.constructor.name}`, schedulingDomain)
            if(!schedulingIsValid.success) return schedulingIsValid

            return ResponseHandler.success()
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
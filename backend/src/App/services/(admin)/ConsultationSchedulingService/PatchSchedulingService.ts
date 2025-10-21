import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { DateSchedulingValidator } from "../../../../domain/validators/ConsultationScheduling/DatesSchedulingValidator";
import { ExistsScheduling } from "../../../../domain/validators/ConsultationScheduling/ExistsScheduling";
import { InsertTimeOfConsultation } from "../../../../domain/validators/ConsultationScheduling/InsertTimeOfConsultation";
import { StatusValidationToUpdated } from "../../../../domain/validators/ConsultationScheduling/StatusValidationToUpdate";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
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
            const allValidators: any= [ new UUIDValidator(), new StatusValidationToUpdated()]

            if(schedulingDTO.date){
                allValidators.push(
                    new DateSchedulingValidator(),
                    new ExistsScheduling()
                )                    
            }
            if(schedulingDomain.status === "CONCLUDE"){
                allValidators.push( new RequiredGeneralData(Object.keys(schedulingDomain.props), [], ["dateOfRealizable"]), new InsertTimeOfConsultation())
                validator.setValidator(`F-doctor`, [
                    new UUIDValidator()
                ])
                const doctorIsValid = await validator.process(`F-doctor`, schedulingDomain.doctor as Doctor)
                if(!doctorIsValid.success) return doctorIsValid
            }

            validator.setValidator(`U-${schedulingDomain.constructor.name}`, allValidators)
            const schedulingIsValid = await validator.process(`U-${schedulingDomain.constructor.name}`, schedulingDomain, this.repository)
            if(!schedulingIsValid.success) return schedulingIsValid
            
            const schedulingUpdated = await this.repository.updateEntity(schedulingDomain,)
            if(!Array.isArray(schedulingUpdated)) return schedulingUpdated

            return ResponseHandler.success(schedulingUpdated, "Success ! Scheduling updated.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { PatientBuilder } from "../../../../domain/entities/EntityPatient/PatientBuilder";
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { SchedulingLinked } from "../../../../domain/validators/Patient/SchedulingLinked";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";

export class RequestConfirmationSchedulingService{
    private schedulingRepository: IRepository;
    private patientRepository: IRepository;

    constructor(){
        this.schedulingRepository = new ConsultationSchedulingRepository()
        this.patientRepository = new PatientRepository()
    }
    async execute(schedulingDTO: ConsultationSchedulingDTO){
        try {
            const patientDomain = new PatientBuilder()
            .setCpf(schedulingDTO.patient.cpf)
            .build()
            patientDomain.setUuidHash(schedulingDTO.patient.id ?? "")

            const schedulingDomain = new SchedulingBuilder()
            .setStatus("CONFIRMED")
            .setPatient(patientDomain)
            .build()
            schedulingDomain.setUuidHash(schedulingDTO.id ?? "")

            const validator = new ValidatorController()
            const validators = [new UUIDValidator(), new EntityExistsToInserted]
        
            validator.setValidator(`FA-${schedulingDomain.constructor.name}`, [
                new SchedulingLinked(),
                ...validators
            ])
            validator.setValidator(`FA-${patientDomain.constructor.name}`, validators)

            const patientIsValid = await validator.process(`FA-${patientDomain.constructor.name}`, patientDomain, this.patientRepository)
            const schedulingIsValid = await validator.process(`FA-${schedulingDomain.constructor.name}`, schedulingDomain, this.schedulingRepository)

            if(!patientIsValid.success) return patientIsValid
            if(!schedulingIsValid.success) return schedulingIsValid

            const schedulingUpdated = await this.schedulingRepository.updateEntity(schedulingDomain)
            if(!Array.isArray(schedulingUpdated)) return schedulingUpdated

            return ResponseHandler.success(schedulingUpdated)
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
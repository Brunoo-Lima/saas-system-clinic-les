import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";


export class RequestCancelSchedulingService {
    private repository: IRepository;
    private doctorRepository: IRepository;

    constructor(){
        this.repository = new ConsultationSchedulingRepository()
        this.doctorRepository = new DoctorRepository()
    }
    async execute(schedulingDTO: ConsultationSchedulingDTO){
        try {
            const doctor = DoctorFactory.createFromDTO(schedulingDTO.doctor)
            doctor.setUuidHash(schedulingDTO?.doctor?.id ?? "")

            const schedulingDomain = new SchedulingBuilder()
            .setStatus(schedulingDTO.status)
            .setDate(undefined)
            .setDoctor(doctor)
            .build()
            schedulingDomain.setUuidHash(schedulingDTO.id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`UDP-${schedulingDomain.constructor.name}`, [
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(schedulingDomain.props), [], ["status"])
            ])
            if(!schedulingDomain.doctor?.getUUIDHash()) return ResponseHandler.error("The doctor is required !")
            validator.setValidator(`UDP-${schedulingDomain.doctor.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])

            const schedulingIsValid = await validator.process(`UDP-${schedulingDomain.constructor.name}`, schedulingDomain, this.repository)
            const doctorIsValid = await validator.process(`UDP-${schedulingDomain.doctor.constructor.name}`, schedulingDomain.doctor, this.doctorRepository)
            const schedulingPerDoctor = await this.repository.findAllEntity(schedulingDomain)
            if(Array.isArray(schedulingPerDoctor) && !schedulingPerDoctor.length) return ResponseHandler.error("This scheduling id and doctor not is linked !")
            if(!schedulingIsValid.success) return schedulingIsValid
            if(!doctorIsValid.success) return doctorIsValid

            const schedulingUpdated = await this.repository.updateEntity(schedulingDomain)
            if(!Array.isArray(schedulingUpdated)) return schedulingUpdated

            return ResponseHandler.success(schedulingUpdated, "Success ! Scheduling Updated.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
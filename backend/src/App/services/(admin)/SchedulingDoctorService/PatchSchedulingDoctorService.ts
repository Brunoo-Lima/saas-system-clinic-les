import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { DoctorSchedulingBuilder } from "../../../../domain/entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { SchedulingBlockedDays } from "../../../../domain/entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { SchedulingDoctorRepository } from "../../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";
import { SchedulingDoctorDTO } from "../../../../infrastructure/DTOs/SchedulingDoctorDTO";

export class PatchSchedulingDoctorService {
    private repository: IRepository;

    constructor(){
        this.repository = new SchedulingDoctorRepository()
    }

    async execute(schedulingDTO: SchedulingDoctorDTO){
        
        try {
            const schedulingDoctorDomain = new DoctorSchedulingBuilder()
            .setDateFrom(schedulingDTO.dateFrom ? new Date(schedulingDTO.dateFrom) : undefined)
            .setDateTo(schedulingDTO.dateTo ? new Date(schedulingDTO.dateTo) : undefined)
            .setDaysBlocked(schedulingDTO.datesBlocked?.map((sh) => {
                const days = new SchedulingBlockedDays({
                    dateBlocked: sh.date ? new Date(sh.date) : undefined,
                    reason: sh.reason
                })
                days.setUuidHash(sh.id ?? "")
                return days
            }) ?? [])
            .setDoctor(DoctorFactory.createFromDTO(schedulingDTO.doctor))
            .setIsActivated(schedulingDTO.isActivate)
            .build()
            schedulingDoctorDomain.setUuidHash(schedulingDTO.id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`U-${schedulingDoctorDomain.constructor.name}`, [ new UUIDValidator(), new EntityExistsToUpdated()])            

            const schedulingDoctorUpdated = await this.repository.updateEntity(schedulingDoctorDomain)
            if(schedulingDoctorUpdated) return ResponseHandler.error("Failure to update the scheduling")

            return ResponseHandler.success(schedulingDoctorUpdated, "Success ! ")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
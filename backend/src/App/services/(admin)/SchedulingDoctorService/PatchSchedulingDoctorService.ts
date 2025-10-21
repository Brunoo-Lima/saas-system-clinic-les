import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { DoctorSchedulingBuilder } from "../../../../domain/entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { Period } from "../../../../domain/entities/EntityPeriod/Period";
import { SchedulingBlockedDays } from "../../../../domain/entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { SpecialtyBuilder } from "../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { SchedulingDoctorRepository } from "../../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";
import { SchedulingDoctorDTO } from "../../../../infrastructure/DTOs/SchedulingDoctorDTO";

export class PatchSchedulingDoctorService {
    private repository: IRepository;
    private periodsRepository: IRepository;

    constructor(){
        this.repository = new SchedulingDoctorRepository()
        this.periodsRepository = new PeriodsRepository()
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
            
            const periods = schedulingDTO.periodToWork?.map((per) => {
                const specialty = new SpecialtyBuilder().build()
                specialty.setUuidHash(per.specialty_id ?? "")
                
                const period = new Period({
                    dayWeek: per.dayWeek ?? undefined,
                    specialty: specialty,
                    timeFrom: per.timeFrom,
                    timeTo: per.timeTo
                })
                period.setUuidHash(per.id ?? "")
                return period
            }) ?? []


            const validator = new ValidatorController()
            validator.setValidator(`U-${schedulingDoctorDomain.constructor.name}`, [ new UUIDValidator() ])

            if(periods.length) {
                validator.setValidator(`U-${periods[0]?.constructor.name}`, [new UUIDValidator() ])
                const periodsIsValid = await validator.process(`U-${periods[0]?.constructor.name}`, periods)
                if(!periodsIsValid.success) return periodsIsValid
            }

            const entitiesUpdated = await db.transaction(async (tx) => {
                const schedulingDoctorUpdated = await this.repository.updateEntity(schedulingDoctorDomain, tx)
                let periodsUpdated;
                if(periods.length) periodsUpdated = await Promise.all(
                    periods.map(async (per) => await this.periodsRepository.updateEntity(per, tx))
                )

                return {
                    periodToWork: periodsUpdated?.flat(),
                    schedulingDoctor: schedulingDoctorUpdated
                }
            })

            if(!entitiesUpdated.periodToWork && !entitiesUpdated.schedulingDoctor) return ResponseHandler.error("Failure to update the scheduling doctor or period to work.")

            return ResponseHandler.success(entitiesUpdated, "Success ! ")
        } catch(e){
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
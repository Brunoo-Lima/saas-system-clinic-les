import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { DoctorSchedulingBuilder } from "../../../../domain/entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { SchedulingBlockedDays } from "../../../../domain/entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { BlockedDatesRepository } from "../../../../infrastructure/database/repositories/BlockedDatesRepository/BlockedDatesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SchedulingDoctorRepository } from "../../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";
import { SchedulingDoctorDTO } from "../../../../infrastructure/DTOs/SchedulingDoctorDTO";

export class PatchSchedulingDoctorService {
    private repository: IRepository;
    private blockedRepository: IRepository;

    constructor(){
        this.repository = new SchedulingDoctorRepository()
        this.blockedRepository = new BlockedDatesRepository()
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
                days.setUuidHash(sh.id || days.getUUIDHash())
                return days
            }) ?? [])
            .setDoctor(DoctorFactory.createFromDTO(schedulingDTO.doctor))
            .setIsActivated(schedulingDTO.isActivate)
            .build()

            schedulingDoctorDomain.setUuidHash(schedulingDTO.id ?? "")
            schedulingDoctorDomain.doctor?.setUuidHash(schedulingDTO.doctor?.id ?? "")
            
            const validator = new ValidatorController()
            validator.setValidator(`U-${schedulingDoctorDomain.constructor.name}`, [ 
                new UUIDValidator()
            ])            

            const schedulingDoctorIsValid = await validator.process(`U-${schedulingDoctorDomain.constructor.name}`, schedulingDoctorDomain, this.repository)
            if(!schedulingDoctorIsValid.success) return schedulingDoctorIsValid;
            if(schedulingDoctorDomain.datesBlocked?.length && schedulingDoctorDomain.datesBlocked[0]){
                validator.setValidator(`F-${schedulingDoctorDomain.datesBlocked[0].constructor.name}`, [
                    new UUIDValidator()
                ])
                const datesBlockedIsValid = await validator.process(`F-${schedulingDoctorDomain.datesBlocked[0].constructor.name}`, schedulingDoctorDomain.datesBlocked)
                if(!datesBlockedIsValid.success) return datesBlockedIsValid
            }

            const entitiesUpdated = await db.transaction(async (tx) => {
                const schedulingDoctorUpdated = await this.repository.updateEntity(schedulingDoctorDomain, tx)
                const datesBlockedUpdated = await this.blockedRepository.updateEntity(schedulingDoctorDomain.datesBlocked ?? [], tx)

                let datesCreated;
                let datesRemoved;

                if(Array.isArray(datesBlockedUpdated)) {
                    const idsUpdated = datesBlockedUpdated.flat().filter((dt) => dt.id).map(dt => dt.id)
                    const datesToCreate = schedulingDoctorDomain.datesBlocked?.filter((dt) => !idsUpdated.includes(dt.getUUIDHash())) ?? []
                    
                    if(datesToCreate.length) {
                        datesCreated = await this.blockedRepository.create(datesToCreate, tx, schedulingDoctorDomain.getUUIDHash())
                        if(Array.isArray(datesCreated)){
                            const idsCreated = datesCreated.filter((dt) => dt.id).map((dt => dt.id))
                            idsUpdated.push(...idsCreated)
                        }
                    
                    }
                    datesRemoved = await this.blockedRepository.deleteEntity(schedulingDoctorDomain.datesBlocked as [], tx, schedulingDoctorDomain.getUUIDHash())
                }

                return {
                    scheduling: schedulingDoctorUpdated[0],
                    datesBlocked: {
                        updated: datesBlockedUpdated.flat(),
                        created: datesCreated,
                        deleted: datesRemoved
                    }
                }
            })

            return ResponseHandler.success(entitiesUpdated, "Success ! ")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
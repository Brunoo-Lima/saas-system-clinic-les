import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { DoctorSchedulingBuilder } from "../../../../domain/entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { SchedulingBlockedDays } from "../../../../domain/entities/EntitySchedulingBlockedDays/SchedulingBlockedDays";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ExistsSchedulingOpened } from "../../../../domain/validators/SchedulingDoctorValidator/ExistsSchedulingOpened";
import { ValidDatesToSchedulingDoctor } from "../../../../domain/validators/SchedulingDoctorValidator/ValidDates";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { BlockedDatesRepository } from "../../../../infrastructure/database/repositories/BlockedDatesRepository/BlockedDatesRepository";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SchedulingDoctorRepository } from "../../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";
import { SchedulingDoctorDTO } from "../../../../infrastructure/DTOs/SchedulingDoctorDTO";

export class CreateSchedulingDoctorService{
    private repository: IRepository;
    private datesBlockRepository: IRepository;
    private doctorRepository: IRepository;

    constructor(){
        this.repository = new SchedulingDoctorRepository()
        this.datesBlockRepository = new BlockedDatesRepository()
        this.doctorRepository = new DoctorRepository()
    }
    async execute(schedulingDoctor: SchedulingDoctorDTO){
        try {
            const doctorDomain = DoctorFactory.createFromDTO(schedulingDoctor.doctor)
            const blockedDays = schedulingDoctor.datesBlocked?.map( dayBlock=> {
                return new SchedulingBlockedDays({
                    dateBlocked: new Date(dayBlock.date),
                    reason: dayBlock.reason
                })
            })
            const schedulingDoctorDomain = new DoctorSchedulingBuilder()
            .setDateFrom(new Date(schedulingDoctor.dateFrom) ?? undefined)
            .setDateTo(new Date(schedulingDoctor.dateTo) ?? undefined)
            .setDaysBlocked(blockedDays)
            .setDoctor(doctorDomain)
            .setIsActivated(true)
            .build()

            schedulingDoctorDomain.doctor?.setUuidHash(schedulingDoctor.doctor.id ?? "")
            
            const validator = new ValidatorController()

            validator.setValidator(`FD-${schedulingDoctorDomain?.doctor?.constructor.name}`, [ new UUIDValidator(), new EntityExistsToInserted()])
            validator.setValidator(`C-${schedulingDoctorDomain.constructor.name}`, [
                new UUIDValidator(),
                new ExistsSchedulingOpened(),
                new ValidDatesToSchedulingDoctor(),
                new RequiredGeneralData(Object.keys(schedulingDoctorDomain.props), ["datesBlocked"]),
            ])
            
            
            const entityIsValid = await validator.process(`C-${schedulingDoctorDomain.constructor.name}`, schedulingDoctorDomain, this.repository)
            const doctorIsValid = await validator.process(`FD-${schedulingDoctorDomain?.doctor?.constructor.name}`, schedulingDoctorDomain.doctor as Doctor, this.doctorRepository)
          
            if(!entityIsValid.success) return entityIsValid
            if(!doctorIsValid.success) return doctorIsValid
            
            const entitiesInserted = await db.transaction(async (tx) => { 
                const response = {
                    scheduling: {},
                    datesBlocked: []
                }
                const schedulingOpened = await this.repository.create(schedulingDoctorDomain, tx)
                response.scheduling = schedulingOpened[0]
                if(blockedDays && blockedDays.length > 0){
                    const datesBlocked = await this.datesBlockRepository.create(blockedDays, tx, schedulingDoctorDomain.getUUIDHash())
                    response.datesBlocked = datesBlocked
                }
                return response;
            })

            if(!Array.isArray(entitiesInserted.datesBlocked) || !entitiesInserted.scheduling) return ResponseHandler.error("The all entities cannot be created !")
            
            return ResponseHandler.success(entitiesInserted, "Success ! Doctor Scheduling is opened.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
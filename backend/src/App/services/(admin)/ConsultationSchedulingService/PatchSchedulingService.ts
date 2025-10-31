import { Doctor } from "../../../../domain/entities/EntityDoctor/Doctor";
import { FinancialBuilder } from "../../../../domain/entities/EntityFinancial/FinancialBuilder";
import { SchedulingFactory } from "../../../../domain/entities/EntityScheduling/SchedulingFactory";
import { Specialty } from "../../../../domain/entities/EntitySpecialty/Specialty";
import { DateSchedulingValidator } from "../../../../domain/validators/ConsultationScheduling/DatesSchedulingValidator";
import { ExistsScheduling } from "../../../../domain/validators/ConsultationScheduling/ExistsScheduling";
import { InsertTimeOfConsultation } from "../../../../domain/validators/ConsultationScheduling/InsertTimeOfConsultation";
import { StatusValidationToUpdated } from "../../../../domain/validators/ConsultationScheduling/StatusValidationToUpdate";
import { CalculateTransfers } from "../../../../domain/validators/FinancialValidator/CalculateTransfers";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { FinancialRepository } from "../../../../infrastructure/database/repositories/FinancialRepository/FinancialRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ConsultationSchedulingDTO } from "../../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { queueCanceledScheduling } from "../../../../infrastructure/queue/queue_email_client";

export class PatchSchedulingService {
    private repository: IRepository & ConsultationSchedulingRepository;
    private financialRepository: IRepository;

    constructor(){
        this.repository = new ConsultationSchedulingRepository();
        this.financialRepository = new FinancialRepository()
    }
    async execute(schedulingDTO: ConsultationSchedulingDTO, id: string | undefined){
        try {
            const schedulingDomain = SchedulingFactory.createFromDTO(schedulingDTO)
            const financialDomain = new FinancialBuilder()
            .setDate(new Date())
            .setScheduling(schedulingDomain)
            .build()

            schedulingDomain.setUuidHash(id ?? "")
            const validator = new ValidatorController()
            const allValidators: any= [ new UUIDValidator() ]

            if(schedulingDTO.date){
                allValidators.push(
                    new DateSchedulingValidator(),
                    new ExistsScheduling()
                )                    
            }
            if(schedulingDomain.status === "CONCLUDE"){
                const specialty = schedulingDomain.specialty

                if(!specialty) return ResponseHandler.error("You should be the specialty to conclude this scheduling")

                allValidators.push(
                    new RequiredGeneralData(Object.keys(schedulingDomain.props), [], ["dateOfRealizable", "specialty"]),
                    new InsertTimeOfConsultation()
                )
                validator.setValidator(`F-doctor`, [
                    new UUIDValidator(),
                    new RequiredGeneralData(Object.keys(schedulingDomain.doctor?.props ?? ""), [], ["specialties"])
                ])
                
                validator.setValidator(`F-specialties`, [
                    new UUIDValidator(),
                ])
                validator.setValidator(`C-${financialDomain.constructor.name}`, [
                    new EntityExits(),
                    new CalculateTransfers(this.repository)
                ])

                const doctorIsValid = await validator.process(`F-doctor`, schedulingDomain.doctor as Doctor)
                if(!doctorIsValid.success) return doctorIsValid
                const specialtiesIsValid = await validator.process(`F-specialties`, specialty as Specialty)
                if(!specialtiesIsValid.success) return specialtiesIsValid
                
                const financialIsValid = await validator.process(`C-${financialDomain.constructor.name}`, financialDomain, this.financialRepository)
                if(!financialIsValid.success) return financialIsValid
         
            }

            validator.setValidator(`U-${schedulingDomain.constructor.name}`, allValidators)
            const schedulingIsValid = await validator.process(`U-${schedulingDomain.constructor.name}`, schedulingDomain, this.repository)
            if(!schedulingIsValid.success) return schedulingIsValid
            
            const entitiesUpdated = await db.transaction(async (tx) => {
                let financialInserted;
                const schedulingUpdated = await this.repository.updateEntity(schedulingDomain, tx)
            
                if(schedulingDomain.status === "CONCLUDE") financialInserted = await this.financialRepository.create(financialDomain, tx)
                return {
                    financial: financialInserted,
                    scheduling: schedulingUpdated
                }
            })

            if(!Array.isArray(entitiesUpdated.financial) && !Array.isArray(entitiesUpdated.scheduling)) return ResponseHandler.error("Sorry...but an error was founded.")
            if(schedulingDomain.status === "CANCELED") await queueCanceledScheduling.add("canceled_scheduling_email", {...entitiesUpdated.scheduling[0], template: "scheduling_canceled"})
                
            return ResponseHandler.success(entitiesUpdated, "Success ! Scheduling updated.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
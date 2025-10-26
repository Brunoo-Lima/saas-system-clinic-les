import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { EntityDomain } from "../../entities/EntityDomain";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { Patient } from "../../entities/EntityPatient/Patient";
import { SchedulingBuilder } from "../../entities/EntityScheduling/SchedulingBuilder";
import { Specialty } from "../../entities/EntitySpecialty/Specialty";
import { IProcessValidator } from "../IProcessValidator";

export class ExistsSchedulingLinked implements IProcessValidator{
    constructor(private repository: IRepository & ConsultationSchedulingRepository){}
    async valid(entity: EntityDomain | Array<EntityDomain>){
        try {
            const builder = new SchedulingBuilder()
            builder.setStatus("PENDING")
            
            if(entity instanceof Doctor) builder.setDoctor(entity)
            if(entity instanceof Patient) builder.setPatient(entity)
            if(entity instanceof Insurance) builder.setInsurance(entity)
            
            if(Array.isArray(entity) && entity.length > 0 && entity[0] instanceof Specialty){
                const schedulingPerSpecialty = (entity as Array<Specialty>).map((et) => {
                    const builderExclusive = new SchedulingBuilder()
                    const domain = builderExclusive
                    .setStatus("PENDING")
                    .setSpecialty(et) 
                    .build()
                    domain.setUuidHash("")

                    return domain
                }).filter(sc => sc.specialty?.getUUIDHash())
                
                const entitiesIsValid = await Promise.all(schedulingPerSpecialty.map(async (sc) => await this.repository.findEntityByLinked(sc)))
                const entities = entitiesIsValid.flat()
                if(entities.length) return ResponseHandler.error("You can't deleted this entity because this's linked with a scheduling PENDING!")
                
                return ResponseHandler.success(entity, "The entity can be deleted")
            }

            const schedulingDomain = builder.build()
            schedulingDomain.setUuidHash("")

            const existsAnyoneScheduling = await this.repository.findEntityByLinked(schedulingDomain)
            
            if(!Array.isArray(existsAnyoneScheduling)) return existsAnyoneScheduling
            if(Array.isArray(existsAnyoneScheduling) && existsAnyoneScheduling.length > 0) return ResponseHandler.error(`The ${entity.constructor.name} cannot be deleted because exists a scheduling PENDING`)
            
            return ResponseHandler.success(entity, "Success ! Not exists scheduling linked")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    } 
}
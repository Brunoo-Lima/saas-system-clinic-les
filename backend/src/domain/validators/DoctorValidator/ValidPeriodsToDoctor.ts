import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { Period } from "../../entities/EntityPeriod/Period";
import { EntityExits } from "../General/EntityExits";
import { RequiredGeneralData } from "../General/RequiredGeneralData";
import { IProcessValidator } from "../IProcessValidator";
import { ValidatorController } from "../ValidatorController";

export class ValidPeriodsToDoctor implements IProcessValidator {
    constructor(private validator: ValidatorController, private repository: IRepository){}    
    async valid(doctor: Doctor){
        try {

            const periods = doctor.periodToWork
            if(!periods) return ResponseHandler.error("You should be only an period")
            
            this.validator.setValidator(`F-${doctor.periodToWork?.constructor.name}`, [
                new RequiredGeneralData(Object.keys(doctor.periodToWork?.[0]?.props ?? {})),
                new EntityExits()
            ])
            
            const periodsIsValid = await this.validator.process(`F-${doctor.periodToWork?.constructor.name}`, periods as Period[], this.repository)
           
            if(!periodsIsValid.success) return ResponseHandler.error(periodsIsValid.message)
            
            return ResponseHandler.success(periods, "The periods is valid !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
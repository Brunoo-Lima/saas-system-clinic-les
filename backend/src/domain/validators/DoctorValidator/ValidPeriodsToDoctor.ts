import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { Period } from "../../entities/EntityPeriod/Period";
import { RequiredGeneralData } from "../General/RequiredGeneralData";
import { IProcessValidator } from "../IProcessValidator";
import { ValidatorController } from "../ValidatorController";

export class ValidPeriodsToDoctor implements IProcessValidator {
    constructor(private validator: ValidatorController){}    
    async valid(doctor: Doctor){
        try {
            const periods = doctor.periodToWork
            this.validator.setValidator(`F-${doctor.periodToWork?.constructor.name}`, [
                new RequiredGeneralData(Object.keys(doctor.periodToWork?.[0]?.props ?? {})),
            ])
            const periodsIsValid = await this.validator.process(`F-${doctor.periodToWork?.constructor.name}`, periods as Period[])
            if(!periodsIsValid.success) return ResponseHandler.error(periodsIsValid.message)
            return ResponseHandler.success(periods, "The periods is valid !")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
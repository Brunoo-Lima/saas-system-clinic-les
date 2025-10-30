import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { Period } from "../../entities/EntityPeriod/Period";
import { EntityExistsToInserted } from "../General/EntityExistsToInserted";
import { EntityExits } from "../General/EntityExits";
import { RequiredGeneralData } from "../General/RequiredGeneralData";
import { IProcessValidator } from "../IProcessValidator";
import { ValidatorController } from "../ValidatorController";

export class ValidPeriodsToDoctor implements IProcessValidator {
    constructor(
        private validator: ValidatorController, 
        private repository: IRepository, 
        private specialtyRepository: IRepository,
        private typeRequest: string = "update" // Se o type for create a validacao precisa ser diferente
    ) { }
    
    async valid(doctor: Doctor) {
        try {

            const periods = doctor.periodToWork
            const timeFrom: any[] = []
            const timeTo: any[] = []
            const daysWeeks: any[] = []
            const hasErrors: any[] = []
            const validators = [new RequiredGeneralData(Object.keys(doctor.periodToWork?.[0]?.props ?? {}))]

            if (!periods) return ResponseHandler.error("You should be only an period")
            for (const period of periods) {
                if (period.timeTo) {
                    (!daysWeeks.includes(period.dayWeek) && timeTo.includes(period.timeTo))
                        ? hasErrors.push(ResponseHandler.error("The timeTo already sended in periods"))
                        : timeFrom.push(period.timeTo)
                }
                if (period.timeFrom) {
                    (!daysWeeks.includes(period.dayWeek) && timeTo.includes(period.timeTo))
                        ? hasErrors.push(ResponseHandler.error("The timeTo already sended in periods"))
                        : timeFrom.push(period.timeTo)
                }
            }

            if (hasErrors.length) return ResponseHandler.error(hasErrors.map((err: { message: any; }) => err.message))
            const specialties = periods.map((per) => per.specialty)

            if(this.typeRequest === "update") { validators.push(new EntityExits())}
            this.validator.setValidator(`F-Specialties-Period`, [new EntityExistsToInserted()])
            this.validator.setValidator(`F-${doctor.periodToWork?.constructor.name}`, validators)

            const periodsIsValid = await this.validator.process(`F-${doctor.periodToWork?.constructor.name}`, periods as Period[], this.repository)
            const specialtiesIsValid = await this.validator.process(`F-Specialties-Period`, specialties, this.specialtyRepository)

            if (!specialtiesIsValid.success) return ResponseHandler.error(specialtiesIsValid.message)
            if (!periodsIsValid.success) return ResponseHandler.error(periodsIsValid.message)

            return ResponseHandler.success(periods, "The periods is valid !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
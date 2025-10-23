import { DoctorFactory } from "../../../../../domain/entities/EntityDoctor/DoctorFactory";
import { ValidPeriodsToDoctor } from "../../../../../domain/validators/DoctorValidator/ValidPeriodsToDoctor";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";

export class AddPeriodsToDoctorService {
    private repository: IRepository;
    constructor(){
        this.repository = new PeriodsRepository()
    }
    async execute(doctorDTO: DoctorDTO){
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            const periods = doctorDomain.periodToWork

            if(!periods) return ResponseHandler.error("You can sent the only an periods !")

            const validator = new ValidatorController()
            validator.setValidator(`${periods.constructor.name}`, [ 
                new UUIDValidator(),
                new ValidPeriodsToDoctor(validator)
            ])
            const canInsertedPeriods = await validator.process(`${periods.constructor.name}`, periods, this.repository)
            if(!canInsertedPeriods.success) return canInsertedPeriods
            
            const periodsInserted = await this.repository.create(periods)
            if(!Array.isArray(periodsInserted)) return periodsInserted

            return ResponseHandler.success(periodsInserted, "Success ! Periods linked to doctor")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { DoctorFactory } from "../../../../../domain/entities/EntityDoctor/DoctorFactory";
import { Period } from "../../../../../domain/entities/EntityPeriod/Period";
import { ValidPeriodsToDoctor } from "../../../../../domain/validators/DoctorValidator/ValidPeriodsToDoctor";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { DoctorDTO } from "../../../../../infrastructure/DTOs/DoctorDTO";

export class AddPeriodsToDoctorService {
    private repository: IRepository;
    private doctorRepository: IRepository;
    private periodRepository: IRepository;

    constructor(){
        this.repository = new PeriodsRepository()
        this.doctorRepository = new DoctorRepository()
        this.periodRepository = new PeriodsRepository()
    }
    async execute(doctorDTO: DoctorDTO){
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            doctorDomain.setUuidHash(doctorDTO.id ?? "")

            const periods = doctorDomain.periodToWork

            if(!Array.isArray(periods) || (periods?.length <= 0)) return ResponseHandler.error("You can sent the only an periods !")

            const validator = new ValidatorController()
            validator.setValidator(`F-${doctorDomain.constructor.name}`, [ 
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])

            validator.setValidator(`C-${doctorDomain.periodToWork?.[0]?.constructor.name}`, [
                new ValidPeriodsToDoctor(validator, this.periodRepository)
            ])
            
            const doctorIsValid = await validator.process(`F-${doctorDomain.constructor.name}`, doctorDomain, this.doctorRepository)
            const periodsIsValid = await validator.process(`C-${doctorDomain.periodToWork?.[0]?.constructor.name}`, doctorDomain, this.repository)
            
            if(!periodsIsValid.success) return periodsIsValid
            if(!doctorIsValid.success) return doctorIsValid
            
            const periodsInserted = await this.repository.create(periods, undefined, doctorDomain.getUUIDHash())
            if(!Array.isArray(periodsInserted)) return periodsInserted

            return ResponseHandler.success(periodsInserted, "Success ! Periods linked to doctor")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
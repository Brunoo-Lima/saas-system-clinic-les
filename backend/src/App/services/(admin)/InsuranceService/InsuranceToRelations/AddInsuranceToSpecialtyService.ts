import { InsuranceFactory } from "../../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { EntityExistsToUpdated } from "../../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidSpecialtyToInsurance } from "../../../../../domain/validators/InsuranceValidator/ValidSpecialtyToInsurance";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { InsuranceDTO } from "../../../../../infrastructure/DTOs/InsuranceDTO";

export class AddInsuranceToSpecialtyService {
    private repository: (IRepository & InsuranceRepository);
    constructor(){
        this.repository = new InsuranceRepository()
    }
    async execute(insuranceDTO: InsuranceDTO){
        try {
            const insuranceDomain = InsuranceFactory.createFromDTO(insuranceDTO)
            const validator = new ValidatorController()

            validator.setValidator(`F-${insuranceDomain.constructor.name}`, [ 
                new UUIDValidator(), 
                new EntityExistsToUpdated(),
                new ValidSpecialtyToInsurance()
            ])
            validator.setValidator(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, [ new UUIDValidator() ])

            const entitiesIsValid = await validator.process(`F-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository)
            const specialtyIsValid = await validator.process(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, insuranceDomain.specialties ?? [])
            
            if(!specialtyIsValid.success) return specialtyIsValid
            if(!entitiesIsValid.success) return entitiesIsValid

            const specialtyVinculated = await this.repository.addSpecialty(insuranceDomain)
            if(!Array.isArray(specialtyVinculated)) return specialtyVinculated

            return ResponseHandler.success(...specialtyVinculated, 'Success ! Specialty inserted.')
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { InsuranceFactory } from "../../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { InsuranceDTO } from "../../../../../infrastructure/DTOs/InsuranceDTO";

export class PatchInsuranceToSpecialtyService {
    private repository: (IRepository & InsuranceRepository);
    constructor(){
        this.repository = new InsuranceRepository()
    }
    async execute(insuranceDTO: InsuranceDTO){
        try {
            const insuranceDomain = InsuranceFactory.createFromDTO(insuranceDTO)
            const validator = new ValidatorController()

            validator.setValidator(`F-${insuranceDomain.constructor.name}`, [ new UUIDValidator(), new EntityExistsToInserted()])
            validator.setValidator(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, [ new UUIDValidator() ])

            const entitiesIsValid = await validator.process(`F-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository)
            const specialtyIsValid = await validator.process(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, insuranceDomain.specialties ?? [])
            
            if(!specialtyIsValid.success) return specialtyIsValid
            if(!entitiesIsValid.success) return entitiesIsValid

            const specialtyVinculated = await this.repository.addSpecialty(insuranceDomain)
            if(!Array.isArray(specialtyVinculated)) return specialtyVinculated

            return ResponseHandler.success(...specialtyVinculated, 'Success ! Data updated')
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
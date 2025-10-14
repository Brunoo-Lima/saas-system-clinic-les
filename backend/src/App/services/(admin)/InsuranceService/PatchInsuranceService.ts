import { InsuranceFactory } from "../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { InsuranceDTO } from "../../../../infrastructure/DTOs/InsuranceDTO";

export class PatchInsuranceService {
    private repository: (IRepository & InsuranceRepository)

    constructor(){
        this.repository = new InsuranceRepository()
    }
    async execute(insuranceDTO: InsuranceDTO, insurance_id: string){
        try {
            insuranceDTO.id = insurance_id
            const insuranceDomain = InsuranceFactory.createFromDTO(insuranceDTO)
            const validator = new ValidatorController()
            validator.setValidator(`P-${insuranceDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToUpdated()
            ])

            const insuranceIsValid = await validator.process(`P-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository)
            if(!insuranceIsValid.success) return insuranceIsValid;
            const insuranceUpdated = await this.repository.updateEntity(insuranceDomain)

            if(!Array.isArray(insuranceUpdated)) return insuranceUpdated
            return ResponseHandler.success(insuranceUpdated, "Success ! Insurance Updated.")
        } catch(e) {
    
            return ResponseHandler.error((e as Error).message)
        }
    }
}
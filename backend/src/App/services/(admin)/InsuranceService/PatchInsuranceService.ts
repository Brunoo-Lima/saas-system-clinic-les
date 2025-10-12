import { InsuranceFactory } from "../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidInsuranceData } from "../../../../domain/validators/InsuranceValidator/ValidInsuranceData";
import { ValidSpecialtyToInsurance } from "../../../../domain/validators/InsuranceValidator/ValidSpecialtyToInsurance";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { InsuranceDTO } from "../../../../infrastructure/DTOs/InsuranceDTO";

export class PatchInsuranceService {
    async execute(insuranceDTO: InsuranceDTO, insurance_id: string){
        try {
            insuranceDTO.id = insurance_id
            const insuranceDomain = InsuranceFactory.createFromDTO(insuranceDTO)
            const validator = new ValidatorController()
            validator.setValidator(`P-${insuranceDomain.constructor.name}`, [
                new UUIDValidator(),
                new ValidInsuranceData(),
                new ValidSpecialtyToInsurance()                
            ])
            const insuranceIsValid = await validator.process(`P-${insuranceDomain.constructor.name}`, insuranceDomain)
            if(!insuranceIsValid.success) return insuranceIsValid;
            const entitiesUpdated = await db.transaction(async (tx) => {
                
            })
            return ResponseHandler.success(insuranceDomain, "Success ! Insurance Updated.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
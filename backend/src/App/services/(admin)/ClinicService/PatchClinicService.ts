import { ClinicFactory } from "../../../../domain/entities/EntityClinic/ClinicFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ClinicRepository } from "../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ClinicDTO } from "../../../../infrastructure/DTOs/ClinicDTO";

export class PatchClinicService {
    private repository: IRepository & ClinicRepository;
    constructor(){
        this.repository = new ClinicRepository()
    }
    async execute(clinicDTO: ClinicDTO){ 
        try {
            const clinicDomain = ClinicFactory.createFromDTO(clinicDTO)
            const validator = new ValidatorController()
            validator.setValidator(`UC-${clinicDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])
            if(clinicDomain.specialties && clinicDomain.specialties[0]){

            }

            const clinicIsValid = await validator.process(`UC-${clinicDomain.constructor.name}`, clinicDomain)
            if(!clinicIsValid.success) return clinicIsValid

            const clinicUpdated = await this.repository.updateEntity(clinicDomain)
            if(!Array.isArray(clinicUpdated)) return clinicUpdated

            return ResponseHandler.success(clinicUpdated, "Success ! Clinic data updated")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
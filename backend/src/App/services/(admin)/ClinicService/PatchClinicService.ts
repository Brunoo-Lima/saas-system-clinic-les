import { ClinicFactory } from "../../../../domain/entities/EntityClinic/ClinicFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ClinicRepository } from "../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { ClinicDTO } from "../../../../infrastructure/DTOs/ClinicDTO";

export class PatchClinicService {
    private repository: IRepository & ClinicRepository;
    private specialtyRepository: IRepository;

    constructor(){
        this.repository = new ClinicRepository()
        this.specialtyRepository = new SpecialtyRepository()
    }
    async execute(clinicDTO: ClinicDTO, id: string | undefined){ 
        try {
            const clinicDomain = ClinicFactory.createFromDTO(clinicDTO)
            clinicDomain.setUuidHash(id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`UC-${clinicDomain.constructor.name}`, [
                new UUIDValidator()
            ])

            if(clinicDomain.specialties && clinicDomain.specialties[0]){
                validator.setValidator(`UPD-${clinicDomain.specialties[0].constructor.name}`, [
                    new UUIDValidator(),
                    new EntityExistsToInserted()
                ])
                const specialtyIsValid = await validator.process(`UPD-${clinicDomain.specialties[0].constructor.name}`, clinicDomain.specialties, this.specialtyRepository)
                if(!specialtyIsValid.success) return specialtyIsValid
            }

            const clinicIsValid = await validator.process(`UC-${clinicDomain.constructor.name}`, clinicDomain, this.repository)
            if(!clinicIsValid.success) return clinicIsValid
            
            const clinicUpdated = await this.repository.updateEntity(clinicDomain)
            if(!Array.isArray(clinicUpdated)) return clinicUpdated

            return ResponseHandler.success(clinicUpdated, "Success ! Clinic data updated")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
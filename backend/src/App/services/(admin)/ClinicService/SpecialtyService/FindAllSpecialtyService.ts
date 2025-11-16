import { ClinicBuilder } from "../../../../../domain/entities/EntityClinic/ClinicBuilder";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { ClinicRepository } from "../../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";

export class FindAllSpecialtyService {
    private repository: IRepository;
    private clinicRepository: IRepository;

    constructor() {
        this.repository = new SpecialtyRepository()
        this.clinicRepository = new ClinicRepository()
    }
    async execute(clinic_id: string | undefined, offset?: string, limit?: string) {
        try {
            const clinicDomain = new ClinicBuilder().build()
            clinicDomain.setUuidHash(clinic_id || "")
            
            const validator = new ValidatorController()
            validator.setValidator(`GETF-${clinicDomain.constructor.name}`, [
                new EntityExistsToInserted(),
                new UUIDValidator()
            ])
            const clinicIsValid = await validator.process(`GETF-${clinicDomain.constructor.name}`, clinicDomain, this.clinicRepository)
            if(!clinicIsValid.success) return clinicIsValid
            
            const regex = /\d+/
            let offsetClean;
            let limitClean;
            
            if (offset && limit && regex.test(offset) && regex.test(limit)) {
                offsetClean = Number(offset)
                limitClean = Number(limit)
            }
            
            const specialties = await this.repository.findAllEntity(undefined, limitClean, offsetClean, clinicDomain.getUUIDHash())

            if (!Array.isArray(specialties.rows)) return specialties
            return ResponseHandler.success(specialties.rows, "Success ! Specialties founded.")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
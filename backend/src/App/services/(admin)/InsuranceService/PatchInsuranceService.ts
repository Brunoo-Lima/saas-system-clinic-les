import { InsuranceFactory } from "../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ModalityRepository } from "../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { InsuranceDTO } from "../../../../infrastructure/DTOs/InsuranceDTO";

export class PatchInsuranceService {
    private repository: (IRepository & InsuranceRepository)
    private specialtyRepository: IRepository;
    private modalityRepository: IRepository;

    constructor(){
        this.repository = new InsuranceRepository()
        this.specialtyRepository = new SpecialtyRepository()
        this.modalityRepository = new ModalityRepository()
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

            validator.setValidator(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])

            validator.setValidator(`U-${insuranceDomain.modalities?.[0]?.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted()
            ])

            const entitiesIsValid =  await Promise.all([
                await validator.process(`P-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository),
                await validator.process(`U-${insuranceDomain.specialties?.[0]?.constructor.name}`, insuranceDomain.specialties ?? [], this.specialtyRepository),
                await validator.process(`U-${insuranceDomain.modalities?.[0]?.constructor.name}`, insuranceDomain.modalities ?? [], this.modalityRepository)
            ])

            const hasErrors = entitiesIsValid.filter((ent) => !ent.success)
            if(hasErrors.length) return ResponseHandler.error(hasErrors.map((err) => err.message[0]));

            const insuranceUpdated = await this.repository.updateEntity(insuranceDomain)

            if(!("insurances" in insuranceUpdated)) return insuranceUpdated
            return ResponseHandler.success(insuranceUpdated, "Success ! Insurance Updated.")
        } catch(e) {
    
            return ResponseHandler.error((e as Error).message)
        }
    }
}
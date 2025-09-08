import { InsuranceBuilder } from "../../../domain/entities/EntityInsurance/InsuranceBuilder";
import { Specialty } from "../../../domain/entities/EntitySpecialty/Specialty";
import { SpecialtyBuilder } from "../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { RequiredGeneralData } from "../../../domain/validators/General/RequiredGeneralData";
import { InsuranceExists } from "../../../domain/validators/InsuranceValidator/InsuranceExists";
import { ValidSpecialtyToInsurance } from "../../../domain/validators/InsuranceValidator/ValidSpecialtyToInsurance";
import { ValidatorController } from "../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceDTO } from "../../../infrastructure/dto/InsuranceDTO";
import { InsuranceRepository } from "../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";

export class CreateInsuranceService {
    private repository: IRepository;
    constructor() {
        this.repository = new InsuranceRepository()
    }
    async execute(insuranceDTO: InsuranceDTO) {
        try {
            const specialties = insuranceDTO.specialties.map((sp) => {
                const specialty = new SpecialtyBuilder().build()
                specialty.setUuidHash(sp ?? "") // Use the correct property name for the id
                return specialty
            })

            const insuranceDomain = new InsuranceBuilder()
                .setType(insuranceDTO.type)
                .setSpecialties(specialties.filter((s) => { if (s.getUUIDHash() !== "") return s })).build()

            const validatorController = new ValidatorController()
            validatorController.setValidator(`C-${insuranceDomain.constructor.name}`, [
                new RequiredGeneralData(Object.keys(insuranceDomain)),
                new ValidSpecialtyToInsurance(),
                new InsuranceExists()
            ])
            const insuranceIsValid = await validatorController.process(`C-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository)

            if (!insuranceIsValid.success) return insuranceIsValid
            const insuranceInserted = await this.repository.create(insuranceDomain)

            if ("error" in insuranceInserted) return insuranceInserted

            return ResponseHandler.success(insuranceInserted, "Insurance added")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
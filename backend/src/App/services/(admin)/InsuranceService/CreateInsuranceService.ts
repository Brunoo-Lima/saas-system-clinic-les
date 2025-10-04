import { InsuranceBuilder } from "../../../../domain/entities/EntityInsurance/InsuranceBuilder";
import { SpecialtyBuilder } from "../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { InsuranceExists } from "../../../../domain/validators/InsuranceValidator/InsuranceExists";
import { ValidSpecialtyToInsurance } from "../../../../domain/validators/InsuranceValidator/ValidSpecialtyToInsurance";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import db from "../../../../infrastructure/database/connection";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { ModalityRepository } from "../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";
import { InsuranceDTO } from "../../../../infrastructure/DTO/InsuranceDTO";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";

export class CreateInsuranceService {
    private repository: IRepository;
    private modalityRepository: IRepository;
    private specialtyRepository: IRepository;

    constructor() {
        this.repository = new InsuranceRepository()
        this.modalityRepository = new ModalityRepository()
        this.specialtyRepository = new SpecialtyRepository()
    }
    async execute(insuranceDTO: InsuranceDTO) {
        try {
            const specialties = insuranceDTO.specialties.map((sp) => {
                const specialty = new SpecialtyBuilder()
                    .setPrice(sp.price ?? 0)
                    .setName(sp.name)
                    .setAmountTransferred(sp.amountTransferred ?? 0)
                    .build()
                specialty.setUuidHash(sp.id ?? "") // Use the correct property name for the id
                return specialty
            })
            const modalities = insuranceDTO.modalities?.map((md) => {
                const modality = new Modality({ name: md.name ?? "" })
                if (md.id) { modality.setUuidHash(md.id) }
                return modality
            })

            const insuranceDomain = new InsuranceBuilder()
                .setName(insuranceDTO.name)
                .setModalities(modalities ?? [])
                .setSpecialties(
                    specialties.filter((s) => { if (s.getUUIDHash() !== "") return s })
                ).build()

            const validatorController = new ValidatorController()
            validatorController.setValidator(`C-${insuranceDomain.constructor.name}`, [
                new RequiredGeneralData(Object.keys(insuranceDomain.props)),
                new ValidSpecialtyToInsurance(),
                new InsuranceExists()
            ])
            validatorController.setValidator('F-Specialties', [
                new EntityExistsToInserted()
            ])

            const specialtiesIsValid = await Promise.all(
                specialties.map(async (sp) => {
                    return await validatorController.process('F-Specialties', sp, this.specialtyRepository)
                })
            )
            const specialtiesValidated = specialtiesIsValid.filter((spv) => !spv.success)
            const insuranceIsValid = await validatorController.process(`C-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository)

            if (specialtiesValidated.length) return ResponseHandler.error(specialtiesValidated.map((spv) => spv.message[0]))
            if (!insuranceIsValid.success) return insuranceIsValid

            const entitiesInserted = await db.transaction(async (tx) => {
                const modalitiesInserted = await Promise.all(
                    (insuranceDomain.modalities ?? []).map(async (mod) => {
                        const result = await findOrCreate(this.modalityRepository, mod, tx);
                        return result[0];
                    })
                );
                
                const insuranceInserted = await this.repository.create(insuranceDomain, tx)
                return {
                    insurance: insuranceInserted[0],
                    modalities: modalitiesInserted
                }
            })

            if (!entitiesInserted.insurance) return ResponseHandler.error("Insurance and modalities cannot be inserted in database")
            return ResponseHandler.success(entitiesInserted, "Insurance added")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
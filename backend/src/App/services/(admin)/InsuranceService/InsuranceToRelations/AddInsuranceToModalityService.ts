import { InsuranceFactory } from "../../../../../domain/entities/EntityInsurance/InsuranceFactory";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import db from "../../../../../infrastructure/database/connection";
import { findOrCreate } from "../../../../../infrastructure/database/repositories/findOrCreate";
import { InsuranceRepository } from "../../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { ModalityRepository } from "../../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";
import { InsuranceDTO } from "../../../../../infrastructure/DTOs/InsuranceDTO";

export class AddInsuranceToModalityService {
    private repository: (IRepository & InsuranceRepository);
    private modalityRepository: IRepository;

    constructor() {
        this.repository = new InsuranceRepository();
        this.modalityRepository = new ModalityRepository();
    }

    async execute(insuranceDTO: InsuranceDTO) {
        try {
            const insuranceDomain = InsuranceFactory.createFromDTO(insuranceDTO);

            const validator = new ValidatorController();
            validator.setValidator(`F-${insuranceDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ]);
            validator.setValidator(`A-${insuranceDomain.modalities?.[0]?.constructor.name}`, [
                new UUIDValidator(true),
                new EntityExistsToInserted(),
            ]);

            const validationResults = await Promise.all([
                validator.process(`F-${insuranceDomain.constructor.name}`, insuranceDomain, this.repository),
                validator.process(
                    `A-${insuranceDomain.modalities?.[0]?.constructor.name}`,
                    insuranceDomain.modalities ?? [],
                    this.modalityRepository
                ),
            ]);

            const hasErrors = validationResults.filter((r) => !r.success);
            if (hasErrors.length) {
                return ResponseHandler.error(hasErrors.map((err) => err.message[0]));
            }

            const entitiesInserted = await db.transaction(async (tx) => {
                await Promise.all(
                    insuranceDomain.modalities?.map(async (mod) => await findOrCreate(this.modalityRepository, mod, tx)) ?? []
                );

                const insuranceToModalityAdded = await this.repository.addModality(insuranceDomain, tx);
                return {linked: insuranceToModalityAdded.flat() };
            });

            if (!entitiesInserted.linked.length) {
                return ResponseHandler.error("Failed to create and link modality to insurance");
            }

            return ResponseHandler.success(entitiesInserted, "Success! Modality linked with the insurance.");
        } catch (e) {
            return ResponseHandler.error((e as Error).message);
        }
    }
}

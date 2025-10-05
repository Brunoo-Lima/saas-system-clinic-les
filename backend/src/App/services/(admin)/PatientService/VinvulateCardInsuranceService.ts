import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";
import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ModalityRepository } from "../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { PatientDTO } from "../../../../infrastructure/DTOs/PatientDTO";

export class VinculateCardInsuranceService {
    private repository: IRepository;
    private cardInsuranceRepository: IRepository;
    private modalityRepository: IRepository;
    private insuranceRepository: IRepository;

    constructor() {
        this.repository = new PatientRepository()
        this.cardInsuranceRepository = new CardInsuranceRepository()
        this.modalityRepository = new ModalityRepository()
        this.insuranceRepository = new InsuranceRepository()
    }
    async execute(patientDTO: PatientDTO) {
        try {
            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            patientDomain.setUuidHash(patientDTO.id ?? "")
            const cardInsurances = patientDTO.cardInsurances.map((cd) => CardInsuranceFactory.createFromDTO(cd))

            if (!Array.isArray(cardInsurances)) return ResponseHandler.error("You should be the card insurance")
            if (Array.isArray(cardInsurances) && !cardInsurances.length) return ResponseHandler.error("The card insurances is empty")

            const validator = new ValidatorController()
            validator.setValidator(`PC-${patientDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ])
            validator.setValidator(`F-CardInsurance`, [
                new EntityExits(),
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(cardInsurances[0]?.props!))
            ])
            validator.setValidator("F-Modality", [
                new EntityExistsToInserted()
            ])
            validator.setValidator('F-Insurance', [
                new EntityExistsToInserted()
            ])

            const modalities = cardInsurances.filter((cd) => cd.modality)?.map((cd) => cd.modality) as Modality[]
            const entitiesIsValid = await Promise.all([
                await validator.process(`PC-${patientDomain.constructor.name}`, patientDomain, this.repository),
                await validator.process('F-CardInsurance', cardInsurances, this.cardInsuranceRepository),
                await validator.process('F-Modality', modalities, this.modalityRepository)
            ])
            const insurancesIsValid = await Promise.all(
                cardInsurances.map(async (cd) => {
                    return await validator.process('F-Insurance', cd.insurance!, this.insuranceRepository)
                })
            )

            const errors = entitiesIsValid.filter((et) => !et.success)
            const insuranceErrors = insurancesIsValid.filter((et) => !et.success)

            if (errors.length) return ResponseHandler.error(errors.map((err) => err.message[0]))
            if (insuranceErrors.length) return ResponseHandler.error(insuranceErrors.map((err) => err.message[0]))

            const cardInsuranceCreated = await this.cardInsuranceRepository.create(cardInsurances, undefined, patientDomain.getUUIDHash())
            return ResponseHandler.success(cardInsuranceCreated, "Success ! Entities vinculate")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
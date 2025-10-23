import { City } from "../../../../domain/entities/EntityAddress/City";
import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { CardInsuranceVinculate } from "../../../../domain/validators/CardInsuranceValidator/CardInsuranceVinculate";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { CityRepository } from "../../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { CountryRepository } from "../../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { StateRepository } from "../../../../infrastructure/database/repositories/StateRepository/StateRepository";
import { PatientDTO } from "../../../../infrastructure/DTOs/PatientDTO";

export class PatchPatientService {
    private repository: IRepository;
    private countryRepository: IRepository;
    private addressRepository: IRepository;
    private stateRepository: IRepository;
    private cityRepository: IRepository;
    private cardInsuranceRepository: IRepository;

    constructor() {
        this.repository = new PatientRepository()
        this.addressRepository = new AddressRepository()
        this.countryRepository = new CountryRepository()
        this.stateRepository = new StateRepository()
        this.cityRepository = new CityRepository()
        this.cardInsuranceRepository = new CardInsuranceRepository()

    }
    async execute(patientDTO: PatientDTO, id: string | undefined) {
        try {
            const returned = {
                deleted: {},
                updated: {}
            }
            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            const address = patientDomain?.address
            const city = address?.city
            const state = city?.state
            const country = state?.country
            
            const cardInsurances = patientDTO.cardInsurances?.map((card) => {
                const cardInsurance = CardInsuranceFactory.createFromDTO(card)
                cardInsurance.setUuidHash(card.id ?? cardInsurance.getUUIDHash())
                return cardInsurance
            }) ?? []

            const validator = new ValidatorController()

            validator.setValidator(`U-${patientDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToUpdated()
            ])

            if (patientDomain.address?.getUUIDHash()) {
                const address = patientDomain.address
                const city = address.city
                const state = city?.state
                const country = state?.country

                validator.setValidator(`U-${address.constructor.name}`, [new EntityExistsToUpdated(), new UUIDValidator()])
                validator.setValidator(`U-${city?.constructor.name ?? "city"}`, [new EntityExistsToUpdated(), new UUIDValidator()])
                validator.setValidator(`U-${state?.constructor.name ?? "state"}`, [new EntityExistsToUpdated(), new UUIDValidator()])
                validator.setValidator(`U-${country?.constructor.name ?? "country"}`, [new EntityExistsToUpdated(), new UUIDValidator()])

                const allEntities = []
                if (city?.getUUIDHash()) allEntities.push(await validator.process(`U-${city?.constructor.name ?? "city"}`, city, this.cityRepository))
                if (state?.getUUIDHash()) allEntities.push(await validator.process(`U-${state?.constructor.name ?? "city"}`, state, this.stateRepository))
                if (country?.getUUIDHash()) allEntities.push(await validator.process(`U-${country?.constructor.name ?? "city"}`, country, this.countryRepository))

                allEntities.push(await validator.process(`U-${address.constructor.name}`, address, this.addressRepository))
                const hasErrors = allEntities.filter((err) => !err.success)
                if (hasErrors.length) return ResponseHandler.error(hasErrors.map((err) => err.message).flat())
            }
            if (cardInsurances.length && cardInsurances[0]) {
                validator.setValidator(`${cardInsurances[0].constructor.name}`, [
                    new UUIDValidator(),
                    new EntityExistsToInserted()
                ])
                const cardInsuranceIsValid = await validator.process(`${cardInsurances[0].constructor.name}`, cardInsurances, this.cardInsuranceRepository)
                if (!cardInsuranceIsValid.success) return cardInsuranceIsValid
            }

        } catch (e) {
            return ResponseHandler.error((e as Error))
        }
    }
}
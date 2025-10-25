import { City } from "../../../../domain/entities/EntityAddress/City";
import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { CardInsuranceVinculate } from "../../../../domain/validators/CardInsuranceValidator/CardInsuranceVinculate";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { CityRepository } from "../../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { CountryRepository } from "../../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
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

            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            patientDomain.setUuidHash(id ?? "")

            const address = patientDomain?.address
            address?.setUuidHash(patientDTO?.address?.id ?? undefined!)

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
                validator.setValidator(`U-${city?.constructor.name ?? "city"}`, [new EntityExistsToUpdated(), new UUIDValidator(), new RequiredGeneralData(Object.keys(city ?? {}))])
                validator.setValidator(`U-${state?.constructor.name ?? "state"}`, [new EntityExistsToUpdated(), new UUIDValidator(), new RequiredGeneralData(Object.keys(state ?? {}))])
                validator.setValidator(`U-${country?.constructor.name ?? "country"}`, [new EntityExistsToUpdated(), new UUIDValidator(), new RequiredGeneralData(Object.keys(country ?? {}))])

                const allEntities = []
                if (city?.getUUIDHash() && city?.name) allEntities.push(await validator.process(`U-${city?.constructor.name ?? "city"}`, city, this.cityRepository))
                if (state?.getUUIDHash() && state?.name) allEntities.push(await validator.process(`U-${state?.constructor.name ?? "city"}`, state, this.stateRepository))
                if (country?.getUUIDHash() && country?.name) allEntities.push(await validator.process(`U-${country?.constructor.name ?? "city"}`, country, this.countryRepository))

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

            const entitiesUpdated = await db.transaction(async (tx) => {
                let cardInsuranceUpdated
                let addressUpdated;

                //Só vai "Criar/procurar se existir valores para isso"
                if (city?.getUUIDHash() && city?.name) await findOrCreate(this.cityRepository, city, tx)
                if (state?.getUUIDHash() && state?.name) await findOrCreate(this.stateRepository, state, tx)
                if (country?.getUUIDHash() && country?.name) await findOrCreate(this.countryRepository, country, tx)
                if (address?.getUUIDHash()) addressUpdated = await this.addressRepository.updateEntity(address, tx)
                if (cardInsurances[0]) cardInsuranceUpdated = await this.cardInsuranceRepository.updateEntity(cardInsurances, tx)
                const patientUpdated = await this.repository.updateEntity(patientDomain, tx)
            
                return {    
                    updated: {
                        patient: patientUpdated,
                        cardInsurance: cardInsuranceUpdated?.updated.flat(),
                        address: addressUpdated
                    },
                    deleted: {
                        cardInsurance: cardInsuranceUpdated?.deleted
                    }
                }
            })
            return ResponseHandler.success(entitiesUpdated, "Success ! The patient and information updated.")
        } catch (e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}
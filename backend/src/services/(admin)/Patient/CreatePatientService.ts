import { Address } from "../../../domain/entities/EntityAddress/Address";
import { PatientFactory } from "../../../domain/entities/EntityPatient/PatientFactory";
import { PropsValidator } from "../../../domain/validators/AddressValidator/PropsValidator";
import { EntityExits } from "../../../domain/validators/General/EntityExits";
import { FormatDateValidator } from "../../../domain/validators/General/FormatDateValidator";
import { RequiredGeneralData } from "../../../domain/validators/General/RequiredGeneralData";
import { ValidatorController } from "../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import db from "../../../infrastructure/database/connection";
import { PatientDTO } from "../../../infrastructure/dto/PatientDTO";
import { AddressRepository } from "../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../infrastructure/database/repositories/Patient/PatientRepository";
import { CountryRepository } from "../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { StateRepository } from "../../../infrastructure/database/repositories/StateRepository/StateRepository";
import { CityRepository } from "../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { NeighborhoodRepository } from "../../../infrastructure/database/repositories/NeighborhoodRepository/NeighbohoodRepository";

export class CreatePatientService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private countryRepository: IRepository;
    private stateRepository: IRepository;
    private cityRepository: IRepository;
    private neighborhoodRepository: IRepository;
    constructor() {
        this.repository = new PatientRepository()
        this.addressRepository = new AddressRepository()
        this.countryRepository = new CountryRepository()
        this.stateRepository = new StateRepository()
        this.cityRepository = new CityRepository()
        this.neighborhoodRepository = new NeighborhoodRepository()
    }
    async execute(patientDTO: PatientDTO) {
        try {

            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            const validatorController = new ValidatorController();

            validatorController.setValidator(patientDomain.constructor.name, [
                new RequiredGeneralData(Object.keys(patientDomain.props), ["user_id"]),
                new EntityExits(),
                new FormatDateValidator()
            ])

            const entityValid = await validatorController.process(patientDomain.constructor.name, patientDomain, this.repository)
            if (!entityValid.success) { return entityValid }
            if (typeof patientDomain.address === "undefined" || !patientDomain.address) { return ResponseHandler.error("Address is required.") }

            validatorController.setValidator(`C-${patientDomain.address.constructor.name}`, [
                new PropsValidator(),
                new EntityExits(patientDomain.address)
            ])

            const addressIsValid = await validatorController.process(`C-${patientDomain.address.constructor.name}`, patientDomain.address, this.addressRepository)
            if (!addressIsValid.success) { return addressIsValid }

            const entitiesInserted = await db.transaction(async () => {
                // Cria o paciente
                const patientInserted = await this.repository.create(patientDomain);
                const neighborhood = patientDomain.address?.neighborhood;
                const city = neighborhood?.city;
                const state = city?.state;
                const country = state?.country;

                // Garantir hierarquia das entidades (busca ou cria)
                const countryEntity = await this.countryRepository.findEntity(country!);
                const stateEntity = await this.stateRepository.findEntity(state!);
                const cityEntity = await this.cityRepository.findEntity(city!);
                const neighborhoodEntity = await this.neighborhoodRepository.findEntity(neighborhood!);

                if (Array.isArray(countryEntity)) { country?.setUuidHash(countryEntity[0].id) }
                if (Array.isArray(stateEntity)) { state?.setUuidHash(stateEntity[0].id) }
                if (Array.isArray(cityEntity)) { city?.setUuidHash(cityEntity[0].id) }
                if (Array.isArray(neighborhoodEntity)) { neighborhood?.setUuidHash(neighborhoodEntity[0].id) }

                if ("success" in countryEntity) { return countryEntity }
                if ("success" in stateEntity) { return stateEntity }
                if ("success" in cityEntity) { return cityEntity }
                if ("success" in neighborhoodEntity) { return neighborhoodEntity }


                if (!Array.isArray(countryEntity)) { 
                    const countryInserted = await this.countryRepository.create(country!)
                    country?.setUuidHash(countryInserted[0].id)
                }
                if (!Array.isArray(stateEntity)) { 
                    const stateInserted = await this.stateRepository.create(state!)
                    country?.setUuidHash(stateInserted[0].id)
                }
                if (!Array.isArray(cityEntity)) { 
                    const cityInserted = await this.cityRepository.create(city!)
                    country?.setUuidHash(cityInserted[0].id)
                }
                if (!Array.isArray(neighborhoodEntity)) { 
                    const neighborhoodInserted = await this.neighborhoodRepository.create(neighborhood!)
                    country?.setUuidHash(neighborhoodInserted[0].id)
                }

                const addressInserted = await this.addressRepository.create(patientDomain.address!)
                // Retorna dados
                return {
                    patient: patientInserted[0],
                    address: addressInserted[0],
                };
            });


            if (!entitiesInserted.patient || !entitiesInserted.address) { return ResponseHandler.error("All entities cannot be created in database...") }
            return ResponseHandler.success({
                ...entitiesInserted,
                ...entitiesInserted
            }, "Success, patient inserted.")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
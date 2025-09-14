import db from "../../../infrastructure/database/connection";
import { Address } from "../../../domain/entities/EntityAddress/Address";
import { PatientFactory } from "../../../domain/entities/EntityPatient/PatientFactory";
import { PropsValidator } from "../../../domain/validators/AddressValidator/PropsValidator";
import { EntityExits } from "../../../domain/validators/General/EntityExits";
import { FormatDateValidator } from "../../../domain/validators/General/FormatDateValidator";
import { RequiredGeneralData } from "../../../domain/validators/General/RequiredGeneralData";
import { ValidatorController } from "../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { PatientDTO } from "../../../infrastructure/dto/PatientDTO";
import { AddressRepository } from "../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../infrastructure/database/repositories/Patient/PatientRepository";
import { CountryRepository } from "../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { StateRepository } from "../../../infrastructure/database/repositories/StateRepository/StateRepository";
import { CityRepository } from "../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { findOrCreate } from "../../../infrastructure/database/repositories/findOrCreate";
import { State } from "../../../domain/entities/EntityAddress/State";
import { City } from "../../../domain/entities/EntityAddress/City";
import { Country } from "../../../domain/entities/EntityAddress/Country";
import { InsuranceToPatient } from "../../../domain/validators/Patient/InsuranceToPatient";
import { UserAlreadyVinculate } from "../../../domain/validators/Patient/UserAlreadyVinculate";

export class CreatePatientService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private countryRepository: IRepository;
    private stateRepository: IRepository;
    private cityRepository: IRepository;

    constructor() {
        this.repository = new PatientRepository()
        this.addressRepository = new AddressRepository()
        this.countryRepository = new CountryRepository()
        this.stateRepository = new StateRepository()
        this.cityRepository = new CityRepository()
    }
    async execute(patientDTO: PatientDTO) {
        try {

            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            const validatorController = new ValidatorController();
            validatorController.setValidator(patientDomain.constructor.name, [
                new RequiredGeneralData(Object.keys(patientDomain.props)),
                new InsuranceToPatient(),
                new UserAlreadyVinculate(),
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

            const entitiesInserted = await db.transaction(async (tx) => {
                try {
                    const addressDomain = patientDomain.address as Address;
                    const cityDomain = patientDomain.address?.city as City;
                    const stateDomain = patientDomain.address?.city?.state as State;
                    const countryDomain = patientDomain.address?.city?.state?.country as Country;

                    await findOrCreate(this.countryRepository, countryDomain, tx);
                    await findOrCreate(this.stateRepository, stateDomain, tx);
                    await findOrCreate(this.cityRepository, cityDomain, tx);
                    
                    const addressInserted = await findOrCreate(this.addressRepository, addressDomain, tx);
                    const patientInserted = await this.repository.create(patientDomain, tx);
                    
                    return ResponseHandler.success({
                        patient:  patientInserted[0],
                        address: addressInserted[0]
                    }, "Entities inserted !")
                    
                } catch (e) {
                    return ResponseHandler.error("Failed to create patient and all data")
                }
            });


            if (!entitiesInserted.success) { return ResponseHandler.error(entitiesInserted.message) }
            return entitiesInserted

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
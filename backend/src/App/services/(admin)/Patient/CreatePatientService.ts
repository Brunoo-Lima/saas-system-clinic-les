import db from "../../../../infrastructure/database/connection";
import { Address } from "../../../../domain/entities/EntityAddress/Address";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { PropsValidator } from "../../../../domain/validators/AddressValidator/PropsValidator";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { FormatDateValidator } from "../../../../domain/validators/General/FormatDateValidator";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { PatientDTO } from "../../../../infrastructure/DTO/PatientDTO";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { CountryRepository } from "../../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { StateRepository } from "../../../../infrastructure/database/repositories/StateRepository/StateRepository";
import { CityRepository } from "../../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { State } from "../../../../domain/entities/EntityAddress/State";
import { City } from "../../../../domain/entities/EntityAddress/City";
import { Country } from "../../../../domain/entities/EntityAddress/Country";
import { UserAlreadyVinculate } from "../../../../domain/validators/Patient/UserAlreadyVinculate";
import { ValidatorEmail } from "../../../../domain/validators/UserValidator/ValidatorEmail";
import { RequiredDataToUserCreate } from "../../../../domain/validators/UserValidator/RequiredDataToUserCreate";
import { ValidatorUserExists } from "../../../../domain/validators/UserValidator/ValidatorUserExists";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { User } from "../../../../domain/entities/EntityUser/User";
import Queue from "../../../../infrastructure/queue/Queue";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { CardInsuranceVinculate } from "../../../../domain/validators/CardInsuranceValidator/CardInsuranceVinculate";
import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";

export class CreatePatientService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private countryRepository: IRepository;
    private stateRepository: IRepository;
    private cityRepository: IRepository;
    private userRepository: IRepository;
    private cardInsuranceRepository: IRepository;

    constructor() {
        this.repository = new PatientRepository()
        this.addressRepository = new AddressRepository()
        this.countryRepository = new CountryRepository()
        this.stateRepository = new StateRepository()
        this.cityRepository = new CityRepository()
        this.userRepository = new UserRepository()
        this.cardInsuranceRepository = new CardInsuranceRepository()

    }
    async execute(patientDTO: PatientDTO) {
        try {

            const validatorController = new ValidatorController();
            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            const cardInsurances = patientDTO.cardInsurances.map((card) => {
                const cardInsurance = CardInsuranceFactory.createFromDTO(card)
                cardInsurance.setUuidHash(card.id ?? cardInsurance.getUUIDHash())
                return cardInsurance
            })

            validatorController.setValidator(patientDomain.constructor.name, [
                new RequiredGeneralData(Object.keys(patientDomain.props)),
                new UserAlreadyVinculate(),
                new EntityExits(),
                new FormatDateValidator()
            ])

            if (typeof patientDomain.address === "undefined" || !patientDomain.address) { return ResponseHandler.error("Address is required.") }
            validatorController.setValidator(`C-${patientDomain.address.constructor.name}`, [
                new PropsValidator(),
                new EntityExits(patientDomain.address)
            ])

            validatorController.setValidator(`C-${patientDomain.user?.constructor.name}`, [
                new ValidatorEmail(),
                new RequiredDataToUserCreate(),
                new ValidatorUserExists()
            ])

            if (cardInsurances && cardInsurances.length) {
                validatorController.setValidator(`C-CardInsurances`, [
                    new CardInsuranceVinculate(),
                    new RequiredGeneralData(Object.keys(cardInsurances[0]?.props ?? {}))
                ])

                const cardInsuranceIsValid = await validatorController.process(`C-CardInsurances`, cardInsurances!, this.cardInsuranceRepository)
                if (!cardInsuranceIsValid.success) return cardInsuranceIsValid;
            }

            const entityValid = await validatorController.process(patientDomain.constructor.name, patientDomain, this.repository)
            const addressIsValid = await validatorController.process(`C-${patientDomain.address.constructor.name}`, patientDomain.address, this.addressRepository)
            const userIsValid = await validatorController.process(`C-${patientDomain.user?.constructor.name}`, patientDomain.user as User, this.userRepository)

            if (!userIsValid.success) { return userIsValid }
            if (!entityValid.success) { return entityValid }
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
                    const userInserted = await this.userRepository.create(patientDomain.user as User, tx)
                    const cartInsurance = await this.cardInsuranceRepository.create(cardInsurances!, tx, patientDomain.getUUIDHash() ?? "")
                    const { password, ...userOmitted } = userInserted.data
                    const patientInserted = await this.repository.create(patientDomain, tx);

                    // Disparo do email para a fila.
                    await Queue.publish(userInserted.data)
                    return ResponseHandler.success({
                        patient: patientInserted[0],
                        address: addressInserted[0],
                        cartInsurance: cartInsurance,
                        user: userOmitted
                    }, "Entities inserted !")

                } catch (e) {
                    return ResponseHandler.error("Failed to create patient and all data")
                }
            });

            if (!entitiesInserted.success || !entitiesInserted.data) { return ResponseHandler.error(entitiesInserted.message) }
            if (!("user" in entitiesInserted.data)) { return ResponseHandler.error("The user cannot be created !") }

            return entitiesInserted

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
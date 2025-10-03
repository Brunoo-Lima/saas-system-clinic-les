import { Address } from "../../../../domain/entities/EntityAddress/Address";
import { City } from "../../../../domain/entities/EntityAddress/City";
import { Country } from "../../../../domain/entities/EntityAddress/Country";
import { State } from "../../../../domain/entities/EntityAddress/State";
import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { User } from "../../../../domain/entities/EntityUser/User";
import { AllValidatorToCreateDoctor } from "../../../../domain/validators/DoctorValidator/AllValidatorsToCreateDoctor";
import { ValidPeriodsToDoctor } from "../../../../domain/validators/DoctorValidator/ValidPeriodsToDoctor";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { CityRepository } from "../../../../infrastructure/database/repositories/CityRepository/CityRepository";
import { CountryRepository } from "../../../../infrastructure/database/repositories/CountryRepository/CountryRepository";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { StateRepository } from "../../../../infrastructure/database/repositories/StateRepository/StateRepository";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { DoctorDTO } from "../../../../infrastructure/dto/DoctorDTO";
import Queue from "../../../../infrastructure/queue/Queue";

export class CreateDoctorService {
    private repository: IRepository;
    private countryRepository: IRepository;
    private addressRepository: IRepository;
    private stateRepository: IRepository;
    private cityRepository: IRepository;
    private userRepository: IRepository;

    constructor() {
        this.repository = new DoctorRepository()
        this.addressRepository = new AddressRepository()
        this.countryRepository = new CountryRepository()
        this.stateRepository = new StateRepository()
        this.cityRepository = new CityRepository()
        this.userRepository = new UserRepository()
    }
    async execute(doctorDTO: DoctorDTO) {
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            const validator = new ValidatorController()
            validator.setValidator(`C-${doctorDomain.constructor.name}`, [
                new UUIDValidator(),
                new ValidPeriodsToDoctor(validator),
                new AllValidatorToCreateDoctor(validator),
                new EntityExits(),
                new RequiredGeneralData(Object.keys(doctorDomain))
            ])

            const entitiesValidated = await validator.process(`C-${doctorDomain.constructor.name}`, doctorDomain, this.repository)
            if (!entitiesValidated.success) return ResponseHandler.error(entitiesValidated.message)

            const entitiesInserted = await db.transaction(async (tx) => {
                try {
                    const addressDomain = doctorDomain.address as Address;
                    const cityDomain = doctorDomain.address?.city as City;
                    const stateDomain = doctorDomain.address?.city?.state as State;
                    const countryDomain = doctorDomain.address?.city?.state?.country as Country;

                    await findOrCreate(this.countryRepository, countryDomain, tx);
                    await findOrCreate(this.stateRepository, stateDomain, tx);
                    await findOrCreate(this.cityRepository, cityDomain, tx);

                    const addressInserted = await findOrCreate(this.addressRepository, addressDomain, tx);
                    const userInserted = await this.userRepository.create(doctorDomain.user as User, tx)
                    const { password, ...userOmitted } = userInserted.data
                    const doctorInserted = await this.repository.create(doctorDomain, tx);

                    // Disparo do email para a fila.
                    await Queue.publish(userInserted.data)
                    return ResponseHandler.success({
                        doctor: doctorInserted[0],
                        address: addressInserted[0],
                        user: userOmitted
                    }, "Entities inserted !")

                } catch (e) {
                    console.log(e)
                    return ResponseHandler.error("Failed to create doctor and all data")
                }
            });

            return entitiesInserted
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
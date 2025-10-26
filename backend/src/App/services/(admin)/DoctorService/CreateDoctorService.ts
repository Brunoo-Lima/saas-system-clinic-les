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
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository";
import { DoctorDTO } from "../../../../infrastructure/DTOs/DoctorDTO";
import { queueClient } from "../../../../infrastructure/queue/queue_email_client";

export class CreateDoctorService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private userRepository: IRepository;
    private periodRepository: IRepository;
    private specialtyRepository: IRepository;

    constructor() {
        this.repository = new DoctorRepository()
        this.addressRepository = new AddressRepository()
        this.userRepository = new UserRepository()
        this.periodRepository = new PeriodsRepository()
        this.specialtyRepository = new SpecialtyRepository()

    }
    async execute(doctorDTO: DoctorDTO) {
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            const validator = new ValidatorController()
            validator.setValidator(`C-${doctorDomain.constructor.name}`, [
                new UUIDValidator(),
                new AllValidatorToCreateDoctor(validator),
                new EntityExits(),
                new ValidPeriodsToDoctor(validator, this.periodRepository, this.specialtyRepository),
                new RequiredGeneralData(Object.keys(doctorDomain))
            ])
            const entitiesValidated = await validator.process(`C-${doctorDomain.constructor.name}`, doctorDomain, this.repository)
            if (!entitiesValidated.success) return ResponseHandler.error(entitiesValidated.message)
            
            const entitiesInserted = await db.transaction(async (tx) => {

                const addressDomain = doctorDomain.address as Address;
                const addressInserted = await this.addressRepository.create(addressDomain, tx);

                const userInserted = await this.userRepository.create(doctorDomain.user as User, tx)
                const { password, ...userOmitted } = userInserted.data
                const doctorInserted = await this.repository.create(doctorDomain, tx);
                const periodsInserted = await this.periodRepository.create(doctorDomain.periodToWork ?? [], tx, doctorDomain.getUUIDHash())
                // Disparo do email para a fila.
                
                userInserted.data.template = "welcome"
                //await queueClient.add("welcome_email", userInserted.data)

                return ResponseHandler.success({
                    doctor: doctorInserted[0],
                    periods: periodsInserted[0],
                    address: addressInserted[0],
                    user: userOmitted
                }, "Entities inserted !")

            });

            return entitiesInserted
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}


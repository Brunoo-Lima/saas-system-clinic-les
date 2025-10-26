import { Address } from "../../../../domain/entities/EntityAddress/Address";
import { City } from "../../../../domain/entities/EntityAddress/City";
import { Country } from "../../../../domain/entities/EntityAddress/Country";
import { State } from "../../../../domain/entities/EntityAddress/State";
import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { findOrCreate } from "../../../../infrastructure/database/repositories/findOrCreate";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PeriodsRepository } from "../../../../infrastructure/database/repositories/PeriodsRepository/PeriodsRepository";
import { DoctorDTO } from "../../../../infrastructure/DTOs/DoctorDTO";

export class PatchDoctorService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private periodsRepository: IRepository;

    constructor() {
        this.repository = new DoctorRepository()
        this.addressRepository = new AddressRepository()
        this.periodsRepository = new PeriodsRepository()
    }
    async execute(doctorDTO: DoctorDTO, id: string | undefined) {
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            doctorDomain.setUuidHash(id ?? "")

            const validator = new ValidatorController()
            validator.setValidator(`U-${doctorDomain.constructor.name}`, [ new UUIDValidator(), new EntityExistsToInserted() ])
            
            const doctorIsValid = await validator.process(`U-${doctorDomain.constructor.name}`, doctorDomain, this.repository)
            if (!doctorIsValid.success) return doctorIsValid

            const entitiesUpdated = await db.transaction(async (tx) => {
                let addressUpdated;
                let periodsUpdated;
                let periodsDeleted;

                if (doctorDTO?.address?.id) {
                    doctorDomain.address?.setUuidHash(doctorDTO.address.id)
                    addressUpdated = await this.addressRepository.updateEntity(doctorDomain.address as Address, tx);
                }

                const doctorUpdated = await this.repository.updateEntity(doctorDomain, tx);
                if(doctorDTO?.periodToWork){
                    periodsUpdated = await Promise.all(doctorDomain.periodToWork?.map(async (per) => {
                        return await this.periodsRepository.updateEntity(per, tx)
                    }) ?? [])
                    periodsDeleted = await this.periodsRepository.deleteEntity(doctorDomain.periodToWork ?? [], tx)
                }

                // Vai apagar tudo que nao estiver dentro do array
                return {
                    updated: {
                        ...doctorUpdated.updated,
                        address:addressUpdated,
                        periodToWork: periodsUpdated
                    },
                    deleted: {
                        specialties: doctorUpdated.deleted.specialties,
                        periodToWork: periodsDeleted
                    }
                }
            })

            return ResponseHandler.success(entitiesUpdated, "Success ! Doctor was updated.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
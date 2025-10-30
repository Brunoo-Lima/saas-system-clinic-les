import { Clinic } from "../../../../../domain/entities/EntityClinic/Clinic"
import { ClinicBuilder } from "../../../../../domain/entities/EntityClinic/ClinicBuilder"
import { Specialty } from "../../../../../domain/entities/EntitySpecialty/Specialty"
import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder"
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted"
import { RequiredGeneralData } from "../../../../../domain/validators/General/RequiredGeneralData"
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator"
import { SpecialtyExists } from "../../../../../domain/validators/SpecialtyValidator/SpecialtiesExists"
import { ValidatorController } from "../../../../../domain/validators/ValidatorController"
import { ResponseHandler } from "../../../../../helpers/ResponseHandler"
import { SpecialtiesDTO } from "../../../../../infrastructure/DTOs/SpecialtiesDTO"
import db from "../../../../../infrastructure/database/connection"
import { ClinicRepository } from "../../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository"
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository"
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository"


export class SpecialtyService {
    private repository: IRepository
    private clinicRepository: IRepository & ClinicRepository

    constructor() {
        this.repository = new SpecialtyRepository()
        this.clinicRepository = new ClinicRepository()
    }
    async execute(specialtyDTO: SpecialtiesDTO, id?: string | undefined) {
        try {

            const validatorController = new ValidatorController()
            if (!Array.isArray(specialtyDTO)) return ResponseHandler.error(["Specialties should be an array !"])
            if (specialtyDTO.length >= 50) return ResponseHandler.error(["Sorry...but you can save only 50 registers per call."])

            const specialties = specialtyDTO.map((s) => {
                const specialty = new SpecialtyBuilder()
                    .setName(s.name)
                    .setPrice(s.price)
                    .build()
                return specialty
            })
            const clinicDomain = new ClinicBuilder()
                .setSpecialties(specialties)
                .build()
            clinicDomain.setUuidHash(id || "")

            validatorController.setValidator(`F-${Clinic.constructor.name}`, [
                new EntityExistsToInserted(),
                new UUIDValidator()
            ])
            validatorController.setValidator(`C-${Specialty.constructor.name}`, [
                new RequiredGeneralData(Object.keys(specialties[0]?.props ?? {})),
                new SpecialtyExists()
            ])

            const dataValidated = await validatorController.process(`C-${Specialty.constructor.name}`, specialties, this.repository)
            const clinicIsValid = await validatorController.process(`F-${Clinic.constructor.name}`, clinicDomain, this.clinicRepository)

            if (!clinicIsValid.success) return clinicIsValid
            if (!dataValidated.success) return dataValidated

            const entitiesCreated = await db.transaction(async (tx) => {
                await this.repository.create(specialties, tx)
                const addedSpecialtiesInClinic = await this.clinicRepository.addedSpecialties(clinicDomain, tx)
    
                return addedSpecialtiesInClinic
            })

            return ResponseHandler.success(entitiesCreated, "Specialties inserted.")
        } catch (error) {
            return ResponseHandler.error([`Failed to create user because: ${(error as Error).message}`]);
        }
    }
}
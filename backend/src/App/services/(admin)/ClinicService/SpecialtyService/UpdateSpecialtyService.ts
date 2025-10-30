import { ClinicBuilder } from "../../../../../domain/entities/EntityClinic/ClinicBuilder";
import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { EntityExistsToInserted } from "../../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import db from "../../../../../infrastructure/database/connection";
import { ClinicRepository } from "../../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { SpecialtiesDTO } from "../../../../../infrastructure/DTOs/SpecialtiesDTO";

export class UpdateSpecialtiesService {
    private repository: IRepository = new SpecialtyRepository()
    private clinicRepository: IRepository & ClinicRepository = new ClinicRepository()

    async execute(specialties: SpecialtiesDTO, clinic_id?: string) {
        try {
            const specialtiesDomain = specialties.map((sp) => {
                const specialty = new SpecialtyBuilder()
                    .setName(sp.name ?? undefined)
                    .setPrice(sp.price)
                    .build()
                specialty.setUuidHash(sp.id ?? specialty.getUUIDHash())
                return specialty
            })
            const clinicDomain = new ClinicBuilder()
            .setSpecialties(specialtiesDomain)
            .build()
            clinicDomain.setUuidHash(clinic_id || "")

            if (!specialtiesDomain || !specialtiesDomain.length) return ResponseHandler.error("You should be only the specialty to updated !")
            const validators = new ValidatorController()
            validators.setValidator(`U-${specialtiesDomain?.[0]?.constructor.name}`, [
                new EntityExistsToInserted(),
                new UUIDValidator()
            ])
            validators.setValidator(`UC-${clinicDomain.constructor.name}`, [
                new EntityExistsToInserted(),
                new UUIDValidator()
            ])

            const entityIsValid = await validators.process(`U-${specialtiesDomain?.[0]?.constructor.name}`, specialtiesDomain, this.repository)
            const clinicIsValid = await validators.process(`UC-${clinicDomain.constructor.name}`, clinicDomain, this.clinicRepository)

            if (!clinicIsValid.success) return clinicIsValid
            if (!entityIsValid.success) return entityIsValid;

            const entitiesUpdated = await db.transaction(async (tx) => {
                const specialtyUpdated = await this.repository.updateEntity(specialtiesDomain, tx)
                const clinicSpecialtiesUpdated = await this.clinicRepository.clinicToSpecialtiesSync(clinicDomain, tx)

                return {
                    updated: {
                        specialties: specialtyUpdated?.flat(),
                        clinicToSpecialties: clinicSpecialtiesUpdated.updated?.flat()
                    },
                    deleted: {
                        clinicToSpecialties: clinicSpecialtiesUpdated.deleted?.flat()
                    }
                }
            })
            return ResponseHandler.success(entitiesUpdated, "Success ! Data updated.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
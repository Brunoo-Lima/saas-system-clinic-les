import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { EntityExistsToUpdated } from "../../../../../domain/validators/General/EntityExistsToUpdated";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { SpecialtiesDTO } from "../../../../../infrastructure/DTOs/SpecialtiesDTO";

export class UpdateSpecialtiesService {
    private repository: IRepository = new SpecialtyRepository()
    async execute(specialties: SpecialtiesDTO) {
        try {
            const specialtiesDomain = specialties.map((sp) => {
                const specialty = new SpecialtyBuilder()
                    .setName(sp.name ?? undefined).build()
                specialty.setUuidHash(sp.id ?? specialty.getUUIDHash())
                return specialty
            })

            if (!specialtiesDomain || !specialtiesDomain.length) return ResponseHandler.error("You should be only the specialty to updated !")
            const validators = new ValidatorController()

            validators.setValidator(`U-${specialtiesDomain?.[0]?.constructor.name}`, [new EntityExistsToUpdated()])
            const entityIsValid = await validators.process(`U-${specialtiesDomain?.[0]?.constructor.name}`, specialtiesDomain, this.repository)
            if (!entityIsValid.success) return entityIsValid;
            const specialtyUpdated = await this.repository.updateEntity(specialtiesDomain)
            return ResponseHandler.success(...specialtyUpdated, "Success ! Data updated.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
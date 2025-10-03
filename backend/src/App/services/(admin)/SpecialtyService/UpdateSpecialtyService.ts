import { SpecialtyBuilder } from "../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { SpecialtiesDTO } from "../../../../infrastructure/DTO/SpecialtiesDTO";

export class UpdateSpecialtiesService {
    private repository: IRepository = new SpecialtyRepository()
    async execute(specialties: SpecialtiesDTO){
        try {
            const specialtiesDomain = specialties.map((sp) => {
                const specialty = new SpecialtyBuilder()
                .setName(sp.name ?? undefined).build()
                specialty.setUuidHash(sp.id ?? specialty.getUUIDHash())
                return specialty
            })
            const specialtyUpdated = await this.repository.updateEntity(specialtiesDomain)
            return ResponseHandler.success(...specialtyUpdated, "Success ! Data updated.")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
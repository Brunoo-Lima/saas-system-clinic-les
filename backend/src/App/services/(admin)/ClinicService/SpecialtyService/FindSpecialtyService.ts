import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { SpecialtiesDTO } from "../../../../../infrastructure/DTOs/SpecialtiesDTO";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";

export class FindSpecialtyService {
    private repository: IRepository
    constructor() {
        this.repository = new SpecialtyRepository()
    }
    async execute(specialtiesDTO: SpecialtiesDTO) {
        try {
            const validator = new ValidatorController()
            const specialties = specialtiesDTO.map((s) => {
                const sp = new SpecialtyBuilder()
                    .setName(s.name ?? "")
                    .setPrice(s.price ?? 0)
                    .build()
                sp.setUuidHash(s.id ?? "")
                return sp
            })
            validator.setValidator("F-Specialty", [
                new UUIDValidator()
            ])

            const entityIsValid = await validator.process('F-Specialty', specialties.filter((sp) => sp.getUUIDHash() !== ""))
            if (!entityIsValid.success) return ResponseHandler.error(entityIsValid.message)

            const specialtiesFounded = await this.repository.findEntity(specialties)
            if (!Array.isArray(specialtiesFounded) && !specialtiesFounded.success) return specialtiesFounded
            if (Array.isArray(specialtiesFounded) && !specialtiesFounded.length) return ResponseHandler.success(specialtiesFounded, "Specialties not found")
            return ResponseHandler.success(specialtiesFounded, "Specialties founded !")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
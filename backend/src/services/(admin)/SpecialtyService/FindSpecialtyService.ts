import { SpecialtyBuilder } from "../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SpecialtiesDTO } from "../../../infrastructure/dto/SpecialtiesDTO";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";

export class FindSpecialtyService {
    private repository: IRepository
    constructor() {
        this.repository = new SpecialtyRepository()
    }
    async execute(specialtiesDTO: SpecialtiesDTO) {
        try {
            const specialties = specialtiesDTO.map((s) => {
                const sp = new SpecialtyBuilder()
                    .setName(s.name ?? "")
                    .setPrice(s.price ?? 0)
                    .build()
                sp.setUuidHash(s.id ?? "")
                return sp
            })
            const specialtiesFounded = await this.repository.findEntity(specialties)
            if ("error" in specialtiesFounded) return specialtiesFounded
            if (Array.isArray(specialtiesFounded) && !specialtiesFounded.length) return ResponseHandler.success(specialtiesFounded, "Specialties not found")
            return ResponseHandler.success(specialtiesFounded, "Specialties founded !")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
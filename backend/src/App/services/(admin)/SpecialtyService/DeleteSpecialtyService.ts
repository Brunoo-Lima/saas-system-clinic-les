import { SpecialtyBuilder } from "../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { SpecialtiesDTO } from "../../../../infrastructure/DTOs/SpecialtiesDTO";

export class DeleteSpecialtyService {
    private repository: IRepository;
    constructor(){ this.repository = new SpecialtyRepository()}

    async execute(specialtiesDTO: SpecialtiesDTO){
        try {
            const specialtiesDomain = specialtiesDTO.map((sp) => {
                const specialty = new SpecialtyBuilder().setName(sp.name).build()
                specialty.setUuidHash(sp.id ?? "")
                return specialty
            })
            const validator = new ValidatorController()
            if(!specialtiesDomain[0]) return ResponseHandler.error("You should be any specialties")

            validator.setValidator(`${specialtiesDomain[0].constructor.name}`, [
                new UUIDValidator()
            ])

        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
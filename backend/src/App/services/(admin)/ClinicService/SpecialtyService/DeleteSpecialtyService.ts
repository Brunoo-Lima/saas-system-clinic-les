import { SpecialtyBuilder } from "../../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { ExistsSchedulingLinked } from "../../../../../domain/validators/General/ExistsSchedulingLinked";
import { UUIDValidator } from "../../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { ConsultationSchedulingRepository } from "../../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { SpecialtiesDTO } from "../../../../../infrastructure/DTOs/SpecialtiesDTO";

export class DeleteSpecialtyService {
    private repository: IRepository;
    private schedulingRepository: IRepository & ConsultationSchedulingRepository;

    constructor() {
        this.repository = new SpecialtyRepository()
        this.schedulingRepository = new ConsultationSchedulingRepository();
    }

    async execute(specialtiesDTO: SpecialtiesDTO) {
        try {
            const specialtiesDomain = specialtiesDTO.map((sp) => {
                const specialty = new SpecialtyBuilder().setName(sp.name).build()
                specialty.setUuidHash(sp.id ?? "")
                return specialty
            })
            const validator = new ValidatorController()
            if (!specialtiesDomain[0]) return ResponseHandler.error("You should be any specialties")

            validator.setValidator(`DE-${specialtiesDomain[0].constructor.name}`, [
                new UUIDValidator(),
                new ExistsSchedulingLinked(this.schedulingRepository)
            ])
            const specialtiesIsValid = await validator.process(`DE-${specialtiesDomain[0].constructor.name}`, specialtiesDomain, this.repository)
            if (!specialtiesIsValid.success) return specialtiesIsValid

            const specialtyDeleted = await this.repository.deleteEntity(specialtiesDomain)
            if (!Array.isArray(specialtyDeleted)) return specialtyDeleted

            return ResponseHandler.success(specialtyDeleted, "The specialties was deleted.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
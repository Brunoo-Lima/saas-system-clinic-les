import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ModalityRepository } from "../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";

export class FindAllModalityService {
    private repository: IRepository;
    constructor() {
        this.repository = new ModalityRepository()
    }
    async execute(id?: string, offset?: string, limit?: string) {
        try {
            const regex = /\d+/
            let offsetClean;
            let limitClean;

            const modalities = [];
            if(id){
                const modality = new Modality({name: ''})
                modality.setUuidHash(id ?? "")
                modalities.push(modality)
            }

            if (offset && limit && regex.test(offset) && regex.test(limit)) {
                offsetClean = Number(offset)
                limitClean = Number(limit)
            }
            const modalitiesFounded = await this.repository.findAllEntity(modalities, limitClean, offsetClean)
            if (!Array.isArray(modalitiesFounded)) return modalitiesFounded
            return ResponseHandler.success(modalitiesFounded, "Success ! Specialties founded.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
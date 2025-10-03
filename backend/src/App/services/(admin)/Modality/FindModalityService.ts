import { Modality } from "../../../../domain/entities/EntityModality/Modality";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ModalityRepository } from "../../../../infrastructure/database/repositories/ModalityRepository/ModalityRepository";
import { ModalityDTO } from "../../../../infrastructure/DTO/ModalityDTO";



export class FindModalityService {
    private repository: IRepository
    constructor() {
        this.repository = new ModalityRepository()
    }
    async execute(modalitiesDTO: Array<ModalityDTO>) {
        try {
            const modalities = modalitiesDTO.map((mod) => {
                const modalityDomain = new Modality({
                    name: mod.name
                })
                modalityDomain.setUuidHash(mod.id ?? "")
                return modalityDomain
            })
            const modalitiesFounded = await this.repository.findAllEntity(modalities)
            if ("success" in modalitiesFounded) { return modalitiesFounded }
            return ResponseHandler.success(modalitiesFounded, "Request to find success !")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
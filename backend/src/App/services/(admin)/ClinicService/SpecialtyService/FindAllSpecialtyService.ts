import { ResponseHandler } from "../../../../../helpers/ResponseHandler";
import { IRepository } from "../../../../../infrastructure/database/repositories/IRepository";
import { SpecialtyRepository } from "../../../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";

export class FindAllSpecialtyService {
    private repository: IRepository;
    constructor() {
        this.repository = new SpecialtyRepository()
    }
    async execute(offset?: string, limit?: string) {
        try {
            const regex = /\d+/
            let offsetClean;
            let limitClean;

            if (offset && limit && regex.test(offset) && regex.test(limit)) {
                offsetClean = Number(offset)
                limitClean = Number(limit)
            }
            const specialties = await this.repository.findAllEntity(undefined, limitClean, offsetClean)
            if (!Array.isArray(specialties)) return specialties
            return ResponseHandler.success(specialties, "Success ! Specialties founded.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
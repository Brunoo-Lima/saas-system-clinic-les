import { ClinicFactory } from "../../../../domain/entities/EntityClinic/ClinicFactory";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { ClinicRepository } from "../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { ClinicDTO } from "../../../../infrastructure/DTOs/ClinicDTO";

export class FindClinicService {
    private repository: IRepository
    constructor() {
        this.repository = new ClinicRepository()
    }
    async execute(clinicDTO: ClinicDTO) {
        try {
            const clinicDomain = ClinicFactory.createFromDTO(clinicDTO)
            const clinicExists = await this.repository.findEntity(clinicDomain)
            if ("success" in clinicExists && !clinicExists.success) return clinicExists

            return ResponseHandler.success(clinicExists, "Success ! data founded.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
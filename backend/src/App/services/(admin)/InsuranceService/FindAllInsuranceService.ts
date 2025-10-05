import { InsuranceBuilder } from "../../../../domain/entities/EntityInsurance/InsuranceBuilder";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export class FindAllInsuranceService {
    private repository: IRepository;
    constructor() {
        this.repository = new InsuranceRepository()
    }
    async execute(id?: string, offset?: string, limit?: string) {
        try {
            const regex = /\d+/
            let offsetClean;
            let limitClean;

            let insurance;
            if(id){
                insurance = new InsuranceBuilder().build()
                insurance.setUuidHash(id ?? "")
            }

            if (offset && limit && regex.test(offset) && regex.test(limit)) {
                offsetClean = Number(offset)
                limitClean = Number(limit)
            }
            const insuranceFounded = await this.repository.findAllEntity(insurance, limitClean, offsetClean)
            if (!Array.isArray(insuranceFounded)) return insuranceFounded
            return ResponseHandler.success(insuranceFounded, "Success ! Specialties founded.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
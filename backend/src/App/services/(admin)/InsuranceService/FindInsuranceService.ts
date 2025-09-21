import { InsuranceBuilder } from "../../../../domain/entities/EntityInsurance/InsuranceBuilder";
import { SpecialtyBuilder } from "../../../../domain/entities/EntitySpecialty/SpecialtyBuilder";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { InsuranceDTO } from "../../../../infrastructure/dto/InsuranceDTO";
import { InsuranceRepository } from "../../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export class FindInsuranceService {
    private repository: IRepository
    constructor() {
        this.repository = new InsuranceRepository()
    }
    async execute(insuranceDTO: InsuranceDTO) {
        try {
            const specialties = insuranceDTO.specialties?.map((sp) => {
                const specialty = new SpecialtyBuilder().build()
                specialty.setUuidHash(sp.id ?? "") // Use the correct property name for the id
                return specialty
            })

            const insuranceDomain = new InsuranceBuilder()
                .setName(insuranceDTO.name)
                .setSpecialties(specialties?.filter((s) => { if (s.getUUIDHash() !== "") return s }))
                .build()

            insuranceDomain.setUuidHash(insuranceDTO.id ?? insuranceDomain.getUUIDHash())
            const insurancesDB = await this.repository.findEntity(insuranceDomain)
            if ("error" in insurancesDB) return insurancesDB
            if (Array.isArray(insurancesDB) && !insurancesDB.length) return ResponseHandler.success(insurancesDB, "Specialties not found")

            return ResponseHandler.success(insurancesDB, "Insurances founded !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
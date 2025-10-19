import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { IProcessValidator } from "../IProcessValidator";

export class ValidSpecialtyToInsurance implements IProcessValidator {
    async valid(insurance: Insurance, repository: InsuranceRepository) {
        try {
            if (!insurance.specialties) { return ResponseHandler.error("To create a insurance you should be send the specialties.") }
            const specialtiesFiltered = insurance.specialties?.filter((s) => s.getUUIDHash() !== "")
            if (!specialtiesFiltered || !specialtiesFiltered.length) return ResponseHandler.error("Insurance should be specialties registered !")
            if (insurance.specialties) {
                const specialtiesToInsurance = await repository.findEntity(insurance)
                const insuranceReturned = specialtiesToInsurance[0]
                if (insuranceReturned) {
                    for (const insp of insurance.specialties) {
                        const specialties = insuranceReturned.specialties as Array<any>;
                        for (const spe of specialties) {
                            if (spe.id === insp.getUUIDHash() || spe.name === insp.name) return ResponseHandler.error(`The specialty: ${spe.name} already linked !`)
                        }
                    }
                }
            }

            return ResponseHandler.success(insurance, "Specialties was valid !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { IProcessValidator } from "../IProcessValidator";

export class ValidSpecialtyToInsurance implements IProcessValidator {
    async valid(insurance: Insurance, repository: InsuranceRepository) {
        try {
            if(!insurance.specialties){ return ResponseHandler.error("To create a insurance you should be send the specialties.")}
            const specialtiesFiltered = insurance.specialties?.filter((s) => s.getUUIDHash() !== "")
            if (!specialtiesFiltered || !specialtiesFiltered.length) return ResponseHandler.error("Insurance should be specialties registered !")
            if (insurance.specialties) {
                const specialtiesToInsurance = await repository.findEntity(insurance)
                specialtiesToInsurance.forEach((sp) => {
                    if(sp.id === insurance.getUUIDHash()){
                        insurance.specialties?.forEach(element => {
                            if(element.name?.toLowerCase() === sp.type.toLowerCase()) throw new Error(`The specialty: ${sp.type} already exists in insurance !`)
                        });
                    }
                })
            }

            return ResponseHandler.success(insurance, "Specialties was valid !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
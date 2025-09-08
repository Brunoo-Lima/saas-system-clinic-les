import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SpecialtyRepository } from "../../../infrastructure/database/repositories/SpecialtyRepository/SpecialtyRepository";
import { Insurance } from "../../entities/EntityInsurance/Insurance";
import { IProcessValidator } from "../IProcessValidator";

export class ValidSpecialtyToInsurance implements IProcessValidator {
    async valid(insurance: Insurance) {
        try {
            const specialtiesFiltered = insurance.specialties?.filter((s) => s.getUUIDHash() !== "")
            if (!specialtiesFiltered || !specialtiesFiltered.length) return ResponseHandler.error("Insurance should be specialties registered !")
            const specialtyRepository = new SpecialtyRepository()

            if (insurance.specialties) {
                const specialtiesFounded = await specialtyRepository.findEntity(insurance.specialties ?? [])
                if (!specialtiesFounded) return ResponseHandler.error("Specialties not found !")
            }

            return ResponseHandler.success(insurance, "Specialties was valid !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
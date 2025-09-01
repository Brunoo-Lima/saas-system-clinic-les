import { Specialty } from "../../../domain/entities/EntitySpecialty/Specialty"
import { SpecialtyBuilder } from "../../../domain/entities/EntitySpecialty/SpecialtyBuilder"
import { RequiredGeneralData } from "../../../domain/validators/General/RequiredGeneralData"
import { SpecialtyExists } from "../../../domain/validators/SpecialtyValidator/SpecialtiesExists"
import { ValidatorController } from "../../../domain/validators/ValidatorController"
import { ResponseHandler } from "../../../helpers/ResponseHandler"
import { specialtiesDTO } from "../../../infrastructure/dto/SpecialtiesDTO"
import { IRepository } from "../../../infrastructure/repositories/IRepository"


export class SpecialtyService {
    constructor(private repository: IRepository) { }
    async execute(specialtyDTO: specialtiesDTO) {
        try {

            const validatorController = new ValidatorController(`C-${Specialty.constructor.name}`)
            if (!Array.isArray(specialtyDTO)) return ResponseHandler.error(["Specialties should be an array !"])
            if (specialtyDTO.length >= 50) return ResponseHandler.error(["Sorry...but you can save only 50 registers per call."])

            const specialties = specialtyDTO.map((s) => new SpecialtyBuilder().setPrice(s.price).setName(s.name).build())
            validatorController.setValidator(`C-${Specialty.constructor.name}`, [
                new RequiredGeneralData(Object.keys(specialties)),
                new SpecialtyExists()
            ])
            const dataValidated = await validatorController.process(specialties, this.repository)
            if (!dataValidated.success) return dataValidated

            const specialtiesAdded = await this.repository.create(specialties)
            return ResponseHandler.success(specialtiesAdded, "Specialties inserted.")

        } catch (error) {
            return ResponseHandler.error([`Failed to create user because: ${(error as Error).message}`]);
        }
    }
}
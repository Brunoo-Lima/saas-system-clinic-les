import { IResponseHandler, ResponseHandler } from "../../../helpers/ResponseHandler";
import { specialtyTable } from "../../../infrastructure/database/schema";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { Specialty } from "../../entities/EntitySpecialty/Specialty";
import { IProcessValidator } from "../IProcessValidator";
import { InferSelectModel } from "drizzle-orm";

export class SpecialtyExists implements IProcessValidator {
    async valid(specialties: Array<Specialty>, repository: IRepository) {
        try {
            const specialtiesDb = await repository.findEntity(specialties) as Array<InferSelectModel<typeof specialtyTable>>;
            if (specialtiesDb.length) {
                return ResponseHandler.error(`This specialties already exists: ${specialtiesDb.map((s) => `${s.name}\n`)}`)
            }
            return ResponseHandler.success(specialties, "Specialties can be inserted !")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }

}
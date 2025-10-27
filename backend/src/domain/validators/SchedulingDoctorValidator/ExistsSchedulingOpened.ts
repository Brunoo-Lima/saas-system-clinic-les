import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { DoctorScheduling } from "../../entities/EntityDoctorScheduling/DoctorScheduling";
import { EntityExits } from "../General/EntityExits";
import { IProcessValidator } from "../IProcessValidator";

export class ExistsSchedulingOpened implements IProcessValidator {
    async valid(schedulingDoctor: DoctorScheduling, repository: IRepository) {
        try {
            const entityValidator = new EntityExits()
            const schedulingCopy = Object.create(schedulingDoctor) as DoctorScheduling // Cópia da entidade original, pois precisamos sobreescrever o valor
            schedulingCopy.is_activate = true // Busca as agendas abertas

            const entityExists = await entityValidator.valid(schedulingCopy, repository)
            if (!entityExists.success) return ResponseHandler.error("The scheduling of the doctor it's still opened !\n\nIf You can closed the scheduling, please, update the scheduling to 'closed'")

            return ResponseHandler.success(schedulingDoctor, "Success ! The scheduling can be open.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { DoctorScheduling } from "../../entities/EntityDoctorScheduling/DoctorScheduling";
import { EntityExits } from "../General/EntityExits";
import { IProcessValidator } from "../IProcessValidator";

export class ExistsSchedulingOpened implements IProcessValidator {
    async valid(schedulingDoctor: DoctorScheduling, repository: IRepository) {
        try {
            const entityValidator = new EntityExits()
            const entityExists = await entityValidator.valid(schedulingDoctor, repository)
            if (!entityExists.success) return ResponseHandler.error("O médico já possui uma agenda aberta !\n\nSe você quer abrir uma nova agenda, atualize a agenda para fechada")

            return ResponseHandler.success(schedulingDoctor, "Success ! The scheduling can be open.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/SchedulingQueriesDAO";
import { SchedulingDoctorRepository } from "../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";
import { DoctorSchedulingBuilder } from "../../entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { Scheduling } from "../../entities/EntityScheduling/Scheduling";
import { IProcessValidator } from "../IProcessValidator";

export class ExistsScheduling implements IProcessValidator {
    async valid(scheduling: Scheduling) {
        try {
            const schedulingDoctor = new DoctorSchedulingBuilder()
            .setIsActivated(true)
            .setDoctor(scheduling.doctor)
            .build()

            const doctorScheduling = new SchedulingDoctorRepository()
            const doctorHasScheduling = await doctorScheduling.findEntity(schedulingDoctor)
            if(!doctorHasScheduling) return ResponseHandler.error("Doctor scheduling is inactivate or not exists !")

            const schedulingDao = new SchedulingQueriesDAO()
            const schedulingToDoctorExists = await schedulingDao.schedulingPerDoctor(scheduling)
            if (Array.isArray(schedulingToDoctorExists.data) && schedulingToDoctorExists.data.length) return ResponseHandler.error("The scheduling cannot be confirmed because already exists the scheduling in this date")
            
            return ResponseHandler.success(scheduling, "Success ! The scheduling can be inserted")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
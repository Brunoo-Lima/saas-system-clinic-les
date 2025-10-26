import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { SchedulingQueriesDAO } from "../../../infrastructure/database/DAO/Queries/SchedulingQueriesDAO";
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
            if (!doctorHasScheduling) return ResponseHandler.error("Doctor scheduling is inactivate or not exists !")

            if (scheduling.date) {
                const dateFrom = new Date(doctorHasScheduling.dateFrom)
                const dateTo = new Date(doctorHasScheduling.dateTo)

                if (scheduling.date < dateFrom || scheduling.date > dateTo) return ResponseHandler.error("This date is't available in scheduling doctor")
                const datesBlocked = doctorHasScheduling.datesBlocked?.filter((dt: any) => {
                    const dateBlocked = new Date(dt.dateBlocked).toISOString().split("T")
                    const dateScheduling = scheduling.date?.toISOString().split("T")
                    return dateScheduling?.[0]?.trim() === dateBlocked[0]?.trim()
                })
                if (datesBlocked?.length) return ResponseHandler.error("This date is blocked in doctor scheduling")
            }
            // const schedulingDao = new SchedulingQueriesDAO()
            // const schedulingToDoctorExists = await schedulingDao.schedulingPerDoctor(scheduling)
            // if (Array.isArray(schedulingToDoctorExists.data) && schedulingToDoctorExists.data.length) return ResponseHandler.error("The scheduling cannot be confirmed because already exists the scheduling in this date")

            return ResponseHandler.success(scheduling, "Success ! The scheduling can be inserted")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
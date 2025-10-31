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
            if (!doctorHasScheduling) return ResponseHandler.error("Agenda do médico fechada !")

            if (scheduling.date) {
                const dateFrom = new Date(doctorHasScheduling.dateFrom)
                const dateTo = new Date(doctorHasScheduling.dateTo)

                if (scheduling.date < dateFrom || scheduling.date > dateTo) return ResponseHandler.error("Data nao encontrada na agenda do medico informada.")
                const datesBlocked = doctorHasScheduling.datesBlocked?.filter((dt: any) => {
                    const dateBlocked = new Date(dt.dateBlocked).toISOString().split("T")
                    const dateScheduling = scheduling.date?.toISOString().split("T")
                    return dateScheduling?.[0]?.trim() === dateBlocked[0]?.trim()
                })
                if (datesBlocked?.length) return ResponseHandler.error("This date is blocked in doctor scheduling")
            }
            if (scheduling.doctor?.getUUIDHash() && scheduling.status && scheduling.status === "PENDING") { 
                // Só iremos realizar a validacao se existir médico vinculado e o status for uma nova consulta/atualizacao de consulta
                const schedulingDao = new SchedulingQueriesDAO()
                const schedulingToDoctorExists = await schedulingDao.schedulingPerDoctor(scheduling)
                if (Array.isArray(schedulingToDoctorExists.data) && schedulingToDoctorExists.data.length) return ResponseHandler.error("O agendamento nao pode ser realizado pois já existe um agendamento marcado para o horário informado (somando o tempo de cosulta)")
            }

            return ResponseHandler.success(scheduling, "Success ! The scheduling can be inserted")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
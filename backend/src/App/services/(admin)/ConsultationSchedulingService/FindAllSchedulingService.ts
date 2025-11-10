import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder"
import { PatientBuilder } from "../../../../domain/entities/EntityPatient/PatientBuilder"
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder"
import { pagination } from "../../../../helpers/pagination"
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { ConsultationSchedulingRepository } from "../../../../infrastructure/database/repositories/ConsultationSchedulingRepository/ConsultationSchedulingRepository"
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository"

export interface schedulingParams {
    scheduling_id: string | undefined
    doctor_id: string | undefined
    patient_id: string | undefined
    scheduling_date: string | undefined
    limit: string | undefined
    offset: string | undefined
}
export class FindAllSchedulingService {
    private repository: IRepository;
    constructor(){
        this.repository = new ConsultationSchedulingRepository()
    }
    async execute(params: schedulingParams) {
        try {
            const {limitClean, offsetClean } = pagination(params.limit, params.offset)
            
            const doctorDomain = new DoctorBuilder().build()
            doctorDomain.setUuidHash(params.doctor_id ?? "")
            
            const patientDomain = new PatientBuilder().build()
            patientDomain.setUuidHash(params.patient_id ?? "")

            const scheduling = new SchedulingBuilder()
            .setDate(params.scheduling_date ? new Date(params.scheduling_date) : undefined)
            .setDoctor(doctorDomain)
            .setPatient(patientDomain)
            .build()

            scheduling.setUuidHash(params.scheduling_id ?? "")
            const schedulingFounded = await this.repository.findAllEntity(scheduling, limitClean, offsetClean)
            if (!Array.isArray(schedulingFounded)) return schedulingFounded

            return ResponseHandler.success(schedulingFounded, "Success ! Response scheduling.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
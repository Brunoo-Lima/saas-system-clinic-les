import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { DoctorSchedulingBuilder } from "../../../../domain/entities/EntityDoctorScheduling/DoctorSchedulingBuilder";
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { SchedulingDoctorRepository } from "../../../../infrastructure/database/repositories/SchedulingDoctorRepository/SchedulingDoctorRepository";

interface SchedulingDoctorParams {
    id: string,
    doctor_id: string,
    is_activate: boolean,
    offset: string,
    limit: string
}

export class GETAllSchedulingDoctorService{
    private repository: IRepository;
    constructor() {
        this.repository = new SchedulingDoctorRepository()
    }
    async handle(params: SchedulingDoctorParams){
        try {
            let doctorDomain;
            let doctorScheduling;
            const regex = /\d+/
            let offsetClean;
            let limitClean;
            if (params.offset && params.limit && regex.test(params.offset) && regex.test(params.limit)) {
                offsetClean = Number(params.offset)
                limitClean = Number(params.limit)
            }
            if(params.id || params.doctor_id){
                doctorDomain = new DoctorBuilder().build()
                doctorDomain.setUuidHash(params.doctor_id)
       
                doctorScheduling = new DoctorSchedulingBuilder()
                .setDoctor(doctorDomain)
                .build()
                doctorScheduling.setUuidHash(params.id)
            }
            const doctorSchedulingFounded = await this.repository.findAllEntity(doctorScheduling, limitClean, offsetClean)
            if(!Array.isArray(doctorSchedulingFounded)) return  doctorSchedulingFounded
            return ResponseHandler.success(doctorSchedulingFounded, "Success ! Data founded")

        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
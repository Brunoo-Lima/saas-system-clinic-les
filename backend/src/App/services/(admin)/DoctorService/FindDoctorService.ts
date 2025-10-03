import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { DoctorDTO } from "../../../../infrastructure/dto/DoctorDTO";

export class FindDoctorService {
    private repository: IRepository;
    constructor() {
        this.repository = new DoctorRepository()
    }
    async execute(doctorDTO: DoctorDTO){
        try {
            const doctorDomain = DoctorFactory.createFromDTO(doctorDTO)
            const doctorExists = await this.repository.findEntity(doctorDomain)

            if("success" in doctorExists && !doctorExists.success) return doctorExists
            return ResponseHandler.success(doctorExists, "Sucess !  Data Founded")
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
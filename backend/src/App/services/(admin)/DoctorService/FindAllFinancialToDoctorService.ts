import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { FinancialBuilder } from "../../../../domain/entities/EntityFinancial/FinancialBuilder";
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { FinancialRepository } from "../../../../infrastructure/database/repositories/FinancialRepository/FinancialRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export class FindAllFinancialToDoctorService {
    private financialRepository: IRepository & FinancialRepository;
    private doctorRepository: IRepository;

    constructor(){
        this.financialRepository = new FinancialRepository()
        this.doctorRepository = new DoctorRepository()
    }

    async execute(id: string | undefined) {
        try {
            const doctorDomain = new DoctorBuilder().build()
            doctorDomain.setUuidHash(id || "")
            
            const schedulingDomain = new SchedulingBuilder()
            .setDoctor(doctorDomain)
            .build()

            const financialDomain = new FinancialBuilder()
            .setScheduling(schedulingDomain)
            .build()
            
            const validator = new ValidatorController()
            validator.setValidator(`FFA-${doctorDomain.constructor.name}`, [ new UUIDValidator(), new EntityExistsToInserted()])
            
            const doctorIsValid = await validator.process(`FFA-${doctorDomain.constructor.name}`, doctorDomain, this.doctorRepository)
            if(!doctorIsValid.success) return doctorIsValid
            
            const allDoctorFinancial = await this.financialRepository.getFinancialPerDoctor(financialDomain)
            return ResponseHandler.success(allDoctorFinancial, "Success ! Data returned.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
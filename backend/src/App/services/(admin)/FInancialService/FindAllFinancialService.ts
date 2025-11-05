import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { FinancialBuilder } from "../../../../domain/entities/EntityFinancial/FinancialBuilder";
import { SchedulingBuilder } from "../../../../domain/entities/EntityScheduling/SchedulingBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { pagination } from "../../../../helpers/pagination";
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { FinancialRepository } from "../../../../infrastructure/database/repositories/FinancialRepository/FinancialRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export interface FinancialParams {
    id: string | undefined,
    date: string | undefined,
    doctor_id: string | undefined
    doctor_crm: string | undefined
    scheduling_id: string | undefined,
    limit: string | undefined
    offset: string | undefined
}

export class FindAllFinancialService {
    private repository: IRepository;
    constructor(){
        this.repository = new FinancialRepository()
    }
    async execute(params: FinancialParams) {
        try {
            let financialDomain;
            const { limitClean, offsetClean } = pagination(params.limit, params.offset)

            if (params.id || params.date || params.doctor_crm || params.doctor_id || params.scheduling_id) {
                const doctor = new DoctorBuilder()
                .setCrm(params.doctor_crm)
                .build()
                doctor.setUuidHash(params.doctor_id ?? "")

                const scheduling = new SchedulingBuilder()
                .setDoctor(doctor)
                .build()
                scheduling.setUuidHash(params.scheduling_id ?? "")

                financialDomain = new FinancialBuilder()
                .setScheduling(scheduling)
                .setDate(params.date ? new Date(params.date) : undefined)
                .build()

                const validator = new ValidatorController()
                financialDomain.setUuidHash(params.id ?? "")

                if (financialDomain.getUUIDHash()) {
                    validator.setValidator(`F-${financialDomain.constructor.name}`, [
                        new UUIDValidator()
                    ])

                    const financialIsValid = await validator.process(`FA-${financialDomain.constructor.name}`, financialDomain, this.repository)
                    if (!financialIsValid.success) return financialIsValid
                }
            }
            const financialFounded = await this.repository.findAllEntity(financialDomain, limitClean, offsetClean)
            if (!Array.isArray(financialFounded)) return financialFounded
            
            return ResponseHandler.success(financialFounded, "Success ! Doctors founded")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
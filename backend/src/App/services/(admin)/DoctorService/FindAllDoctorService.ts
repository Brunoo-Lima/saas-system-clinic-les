import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { DoctorFactory } from "../../../../domain/entities/EntityDoctor/DoctorFactory";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { pagination } from "../../../../helpers/pagination";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export interface FindDoctorParams {
    id?: string | undefined,
    cpf?: string | undefined,
    crm?: string | undefined,
    offset?: string | undefined,
    limit?: string | undefined
}

export class FindAllDoctorService {
    private repository: IRepository;
    constructor() {
        this.repository = new DoctorRepository()
    }
    async execute(params: FindDoctorParams) {
        try {
            let doctorDomain;
            const {limitClean, offsetClean } = pagination(params.limit, params.offset)

            if (params.id || params.cpf || params.crm) {
                doctorDomain = new DoctorBuilder()
                    .setCpf(params.cpf)
                    .setCrm(params.crm)
                    .build()

                const validator = new ValidatorController()
                doctorDomain.setUuidHash(params.id ?? "")
                if (doctorDomain.getUUIDHash()) {
                    validator.setValidator(`FA-${doctorDomain.constructor.name}`, [
                        new UUIDValidator()
                    ])

                    const patientIsValid = await validator.process(`FA-${doctorDomain.constructor.name}`, doctorDomain, this.repository)
                    if (!patientIsValid.success) return patientIsValid
                }
            }
            const doctorsFounded = await this.repository.findAllEntity(doctorDomain, limitClean, offsetClean)
            if (!Array.isArray(doctorsFounded)) return doctorsFounded
            return ResponseHandler.success(doctorsFounded, "Success ! Doctors founded")

        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
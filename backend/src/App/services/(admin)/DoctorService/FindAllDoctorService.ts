import { DoctorBuilder } from "../../../../domain/entities/EntityDoctor/DoctorBuilder";
import { UserBuilder } from "../../../../domain/entities/EntityUser/UserBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { pagination } from "../../../../helpers/pagination";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { DoctorRepository } from "../../../../infrastructure/database/repositories/DoctorRepository/DoctorRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export interface FindDoctorParams {
    id?: string | undefined,
    cpf?: string | undefined,
    user_id?: string | undefined,
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
            if (params.id || params.cpf || params.crm || params.user_id) {
                const userDomain = new UserBuilder().build()
                userDomain.setUuidHash(params.user_id ?? "")

                doctorDomain = new DoctorBuilder()
                    .setCpf(params.cpf)
                    .setCrm(params.crm)
                    .setUser(userDomain)
                    .build()
                    
                const validator = new ValidatorController()
                doctorDomain.setUuidHash(params.id ?? "")
                if (userDomain.getUUIDHash()){
                    validator.setValidator(`FA-${userDomain.constructor.name}`, [ new UUIDValidator() ])
                    const userValidator = await validator.process(`FA-${userDomain.constructor.name}`, userDomain)
                    if(!userValidator.success) return userValidator
                }

                if (doctorDomain.getUUIDHash()) {
                    validator.setValidator(`FA-${doctorDomain.constructor.name}`, [ new UUIDValidator() ])
                    const doctorIsValid = await validator.process(`FA-${doctorDomain.constructor.name}`, doctorDomain, this.repository)
                    if (!doctorIsValid.success) return doctorIsValid
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
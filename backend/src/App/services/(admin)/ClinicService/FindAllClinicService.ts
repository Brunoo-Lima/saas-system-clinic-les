import { ClinicBuilder } from "../../../../domain/entities/EntityClinic/ClinicBuilder";
import { UserBuilder } from "../../../../domain/entities/EntityUser/UserBuilder";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { ClinicRepository } from "../../../../infrastructure/database/repositories/ClinicRepository/ClinicRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";

export interface ClinicParams {
    id: string | undefined,
    cnpj: string | undefined,
    offset: string | undefined,
    limit: string | undefined,
    user_email: string | undefined,
    user_id: string | undefined
}

export class FindAllClinicService {
    private repository: IRepository;
    constructor() {
        this.repository = new ClinicRepository()
    }
    async execute(params: ClinicParams) {
        try {
            let userDomain;
            let clinicDomain;

            const regex = /\d+/
            let offsetClean;
            let limitClean;
            if (params.offset && params.limit && regex.test(params.offset) && regex.test(params.limit)) {
                offsetClean = Number(params.offset)
                limitClean = Number(params.limit)
            }

            const paramsFiltered = Object.entries(params).filter(([k, v]) => !['limit', 'offset'].includes(k) && v)
            const hasParams = paramsFiltered?.[0]

            if (hasParams?.length) {
                const validator = new ValidatorController()

                userDomain = new UserBuilder().setEmail(params.user_email).build()
                clinicDomain = new ClinicBuilder()
                .setCNPJ(params.cnpj)
                .setUser(userDomain)
                .build()


                userDomain.setUuidHash(params.user_id ?? "")
                clinicDomain.setUuidHash(params.id ?? "")

                validator.setValidator(`F-${clinicDomain.constructor.name}`, [new UUIDValidator(true)])
                validator.setValidator(`F-${userDomain.constructor.name}`, [new UUIDValidator(true)])
                const entitiesValid = await Promise.all([
                    await validator.process(`F-${clinicDomain.constructor.name}`, clinicDomain),
                    await validator.process(`F-${userDomain.constructor.name}`, userDomain)
                ])
                const hasErrors = entitiesValid.filter((e) => !e.success)
                if(hasErrors.length){ return ResponseHandler.error(hasErrors.map((e) => e.message[0]))}
            }

            const clinicFounded = await this.repository.findAllEntity(clinicDomain, limitClean, offsetClean)
            if(!Array.isArray(clinicFounded)) return clinicFounded

            return ResponseHandler.success(clinicFounded, "Success ! Data founded")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
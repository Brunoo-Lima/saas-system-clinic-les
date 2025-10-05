import { PatientBuilder } from "../../../../domain/entities/EntityPatient/PatientBuilder"
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator"
import { ValidatorController } from "../../../../domain/validators/ValidatorController"
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository"
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository"

export interface FindParams {
    id?: string | undefined, 
    cpf?: string | undefined,  
    offset?: string | undefined, 
    limit?: string | undefined
}

export class FindAllPatientService {
    private repository: IRepository;
    constructor(){
        this.repository = new PatientRepository()
    }
    async execute(params: FindParams) {
        try {
            let patientDomain;
            const regex = /\d+/
            let offsetClean;
            let limitClean;
            if (params.offset && params.limit && regex.test(params.offset) && regex.test(params.limit)) {
                offsetClean = Number(params.offset)
                limitClean = Number(params.limit)
            }
            if(params.id || params.cpf){
                patientDomain = new PatientBuilder().setCpf(params.cpf).build()
                const validator = new ValidatorController()
                patientDomain.setUuidHash(params.id ?? "")
                validator.setValidator(`FA-${patientDomain.constructor.name}`, [
                    new UUIDValidator()
                ])
                const patientIsValid = await validator.process(`FA-${patientDomain.constructor.name}`, patientDomain, this.repository)
                if(!patientIsValid.success) return patientIsValid
            }
            const patientsFounded = await this.repository.findAllEntity(patientDomain, limitClean, offsetClean)
            if(!Array.isArray(patientsFounded)) return patientsFounded
            return ResponseHandler.success(patientsFounded, "Success ! Patients founded")
            
        } catch(e){
            return ResponseHandler.error((e as Error).message)
        }
    }
}
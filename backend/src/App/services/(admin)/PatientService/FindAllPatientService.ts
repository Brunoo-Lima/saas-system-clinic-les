import { PatientBuilder } from "../../../../domain/entities/EntityPatient/PatientBuilder"
import { UserBuilder } from "../../../../domain/entities/EntityUser/UserBuilder"
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted"
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator"
import { ValidatorController } from "../../../../domain/validators/ValidatorController"
import { ResponseHandler } from "../../../../helpers/ResponseHandler"
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository"
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository"
import { UserRepository } from "../../../../infrastructure/database/repositories/UserRepository/UserRepository"

export interface FindParams {
    id?: string | undefined, 
    cpf?: string | undefined, 
    user_id?:string | undefined, 
    offset?: string | undefined, 
    limit?: string | undefined
}

export class FindAllPatientService {
    private repository: IRepository;
    private userRepository: IRepository;

    constructor(){
        this.repository = new PatientRepository()
        this.userRepository = new UserRepository()
    }
    async execute(params: FindParams) {
        try {
            let patientDomain;
            let userDomain;

            const regex = /\d+/
            let offsetClean;
            let limitClean;
            const validator = new ValidatorController()

            if (params.offset && params.limit && regex.test(params.offset) && regex.test(params.limit)) {
                offsetClean = Number(params.offset)
                limitClean = Number(params.limit)
            }

            if(params.id || params.cpf || params.user_id){
                const userDomain = new UserBuilder().build()
                userDomain.setUuidHash(params.user_id ?? "")
                validator.setValidator(`FA-${userDomain.constructor.name}`, [ new UUIDValidator(true) ])
                
                const userIsValid = await validator.process(`FA-${userDomain.constructor.name}`, userDomain, this.userRepository)
                if(!userIsValid.success) return userIsValid
                
                patientDomain = new PatientBuilder()
                .setCpf(params.cpf)
                .setUser(userDomain)
                .build()
                
                patientDomain.setUuidHash(params.id ?? "")
                validator.setValidator(`FA-${patientDomain.constructor.name}`, [
                    new UUIDValidator(true)
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
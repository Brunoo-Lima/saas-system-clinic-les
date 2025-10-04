import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExits } from "../../../../domain/validators/General/EntityExits";
import { RequiredGeneralData } from "../../../../domain/validators/General/RequiredGeneralData";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { PatientDTO } from "../../../../infrastructure/DTO/PatientDTO";

export class VinculateCardInsuranceService {
    private repository: IRepository;
    private cardInsuranceRepository: IRepository;

    constructor(){
        this.repository = new PatientRepository()
        this.cardInsuranceRepository = new CardInsuranceRepository()

    }
    async execute(patientDTO: PatientDTO){
        try {
            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            patientDomain.setUuidHash(patientDTO.id ?? "")

            const cardInsurances = patientDTO.cardInsurances.map((cd) => CardInsuranceFactory.createFromDTO(cd))

            if(!Array.isArray(cardInsurances)) return ResponseHandler.error("You should be the card insurance")
            if(Array.isArray(cardInsurances) && !cardInsurances.length) return ResponseHandler.error("The card insurances is empty")

            const validator = new ValidatorController()
            validator.setValidator(`PC-${patientDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToInserted(),
            ])
            validator.setValidator(`F-CardInsurance`, [
                new EntityExits(),
                new UUIDValidator(),
                new RequiredGeneralData(Object.keys(cardInsurances[0]?.props!))
            ])
            const patientIsValid = await validator.process(`PC-${patientDomain.constructor.name}`, patientDomain, this.repository)
            const cardInsurancesIsValid = await validator.process('F-CardInsurance', cardInsurances, this.cardInsuranceRepository)
            
            if(!cardInsurancesIsValid.success) return cardInsurancesIsValid
            if(!patientIsValid.success) return patientIsValid

            return patientDomain
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
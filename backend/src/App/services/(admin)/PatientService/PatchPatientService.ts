import { CardInsuranceFactory } from "../../../../domain/entities/EntityCardInsurance/CardInsuranceFactory";
import { PatientFactory } from "../../../../domain/entities/EntityPatient/PatientFactory";
import { EntityExistsToInserted } from "../../../../domain/validators/General/EntityExistsToInserted";
import { EntityExistsToUpdated } from "../../../../domain/validators/General/EntityExistsToUpdated";
import { UUIDValidator } from "../../../../domain/validators/General/UUIDValidator";
import { ValidatorController } from "../../../../domain/validators/ValidatorController";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../../../infrastructure/database/connection";
import { AddressRepository } from "../../../../infrastructure/database/repositories/AddressRepository/AddressRepository";
import { CardInsuranceRepository } from "../../../../infrastructure/database/repositories/CardInsuranceRepository/CardInsuranceRepository";
import { IRepository } from "../../../../infrastructure/database/repositories/IRepository";
import { PatientRepository } from "../../../../infrastructure/database/repositories/PatientRepository/PatientRepository";
import { PatientDTO } from "../../../../infrastructure/DTOs/PatientDTO";

export class PatchPatientService {
    private repository: IRepository;
    private addressRepository: IRepository;
    private cardInsuranceRepository: IRepository;

    constructor() {
        this.repository = new PatientRepository()
        this.addressRepository = new AddressRepository()
        this.cardInsuranceRepository = new CardInsuranceRepository()

    }
    async execute(patientDTO: PatientDTO, id: string | undefined) {
        try {

            const patientDomain = PatientFactory.createFromDTO(patientDTO)
            patientDomain.setUuidHash(id ?? "")

            const address = patientDomain?.address
            address?.setUuidHash(patientDTO?.address?.id ?? undefined!)

            const cardInsurances = patientDTO.cardInsurances?.map((card) => {
                const cardInsurance = CardInsuranceFactory.createFromDTO(card)
                cardInsurance.setUuidHash(card.id ?? cardInsurance.getUUIDHash())
                return cardInsurance
            }) ?? []

            const validator = new ValidatorController()

            validator.setValidator(`U-${patientDomain.constructor.name}`, [
                new UUIDValidator(),
                new EntityExistsToUpdated()
            ])

            if (patientDomain.address?.getUUIDHash()) {
                const address = patientDomain.address

                validator.setValidator(`U-${address.constructor.name}`, [new EntityExistsToInserted(), new UUIDValidator()])
                const addressIsValid = await validator.process(`U-${address.constructor.name}`, address, this.addressRepository)
                if (!addressIsValid.success) return addressIsValid
            }

            if (cardInsurances.length && cardInsurances[0]) {
                validator.setValidator(`U-${cardInsurances[0].constructor.name}`, [
                    new UUIDValidator(),
                    new EntityExistsToInserted()
                ])
                const cardInsuranceIsValid = await validator.process(`U-${cardInsurances[0].constructor.name}`, cardInsurances, this.cardInsuranceRepository)
                if (!cardInsuranceIsValid.success) return cardInsuranceIsValid
            }

            const entitiesUpdated = await db.transaction(async (tx) => {
                let cardInsuranceUpdated
                let addressUpdated;

                //Só vai "Criar/procurar se existir valores para isso"
                if (address?.getUUIDHash()) addressUpdated = await this.addressRepository.updateEntity(address, tx)
                if (cardInsurances[0]) cardInsuranceUpdated = await this.cardInsuranceRepository.updateEntity(cardInsurances, tx)
                const patientUpdated = await this.repository.updateEntity(patientDomain, tx)
            
                return {    
                    updated: {
                        patient: patientUpdated,
                        cardInsurance: cardInsuranceUpdated?.updated.flat(),
                        address: addressUpdated
                    },
                    deleted: {
                        cardInsurance: cardInsuranceUpdated?.deleted
                    }
                }
            })
            return ResponseHandler.success(entitiesUpdated, "Success ! The patient and information updated.")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
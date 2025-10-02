import { ResponseHandler } from "../../../helpers/ResponseHandler";
import { InsuranceRepository } from "../../../infrastructure/database/repositories/InsurancesRepository/InsurancesRepository";
import { IRepository } from "../../../infrastructure/database/repositories/IRepository";
import { CardInsurance } from "../../entities/EntityCardInsurance/CardInsurance";
import { ValidInsuranceData } from "../InsuranceValidator/ValidInsuranceData";
import { IProcessValidator } from "../IProcessValidator";

export class CardInsuranceVinculate implements IProcessValidator {
    async valid(cardInsurance: CardInsurance | Array<CardInsurance>, repository: IRepository) {
        try {
            const insuranceValidator = new ValidInsuranceData()
            const cardInsuranceFiltered = Array.isArray(cardInsurance) ? cardInsurance : [cardInsurance]
            const entityExits = await repository.findEntity(cardInsuranceFiltered)
            const messagesError = []

            for(const card of cardInsuranceFiltered){
                if(!card.modality?.getUUIDHash()) { return ResponseHandler.error("You can send the id of modality !")}
                const insuranceExists = await insuranceValidator.valid(card.insurance!, new InsuranceRepository())
                if(!insuranceExists.success) return insuranceExists;
                if(!insuranceExists.data) return ResponseHandler.error(`Insurance not found to card: ${card.insurance?.name}`)
            }
            if(!entityExits || !entityExits.length) return ResponseHandler.success(entityExits, "The insurance card can be inserted")
            
            for(const card of entityExits){
                messagesError.push(`Already exits the insurance card with id or number: ${card.id}`)
            }
            if(messagesError){ return ResponseHandler.error(messagesError)}

            return ResponseHandler.success("The insurance card is valid !")
        } catch (e) {
            return ResponseHandler.error((e as Error).message)
        }
    }
}
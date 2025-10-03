import { CardDTO } from "../../../infrastructure/DTO/CardDTO";
import { InsuranceBuilder } from "../EntityInsurance/InsuranceBuilder";
import { Modality } from "../EntityModality/Modality";
import { CartInsuranceBuilder } from "./CardInsuranceBuilder";

export class CardInsuranceFactory {
    static createFromDTO(cardDTO: CardDTO) {
        const modality = new Modality({
            name: cardDTO.modality.name
        })
        modality.setUuidHash(cardDTO.modality.id ?? modality.getUUIDHash())

        const insurance = new InsuranceBuilder()
            .setName(cardDTO.insurance.name ?? "")
            .build()
        insurance.setUuidHash(cardDTO.insurance.id ?? insurance.getUUIDHash())

        const cardInsurance = new CartInsuranceBuilder()
            .setCardNumber(cardDTO.cardInsuranceNumber)
            .setInsurance(insurance)
            .setModality(modality)
            .setValidate(cardDTO.validate)
            .build()

        return cardInsurance;
    }
}

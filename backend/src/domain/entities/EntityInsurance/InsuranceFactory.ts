
import { InsuranceDTO } from "../../../infrastructure/DTOs/InsuranceDTO";
import { Modality } from "../EntityModality/Modality";
import { SpecialtyBuilder } from "../EntitySpecialty/SpecialtyBuilder";
import { InsuranceBuilder } from "./InsuranceBuilder";

export class InsuranceFactory {
    static createFromDTO(insuranceDTO: InsuranceDTO) {
        const modalities = insuranceDTO.modalities?.map((md) => {
            const modality = new Modality({ name: md.name })
            modality.setUuidHash(md.id ?? "")
            return modality
        })
        const specialties = insuranceDTO.specialties?.map((sp) => {
            const specialty = new SpecialtyBuilder()
                .setName(sp.name)
                .setPrice(sp.price)
                .setAmountTransferred(sp.amountTransferred)
                .build()
            specialty.setUuidHash(sp.id ?? "")
            return specialty
        })

        const insuranceDomain = new InsuranceBuilder()
            .setName(insuranceDTO.name)
            .setModalities(modalities)
            .setSpecialties(specialties)
            .build()
        insuranceDomain.setUuidHash(insuranceDTO.id ?? "")
        return insuranceDomain
    }

}

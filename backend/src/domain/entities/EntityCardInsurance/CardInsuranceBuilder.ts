import { ICardInsurance } from "./types/ICardInsurance";
import { Insurance } from "../EntityInsurance/Insurance";
import { Modality } from "../EntityModality/Modality";
import { Patient } from "../EntityPatient/Patient";
import { CardInsurance } from "./CardInsurance";

export class CartInsuranceBuilder {
  private data: Partial<ICardInsurance> = {};

  setCardNumber(cardNumber: string): this {
    this.data.cardNumber = cardNumber;
    return this;
  }


  setValidate(validate: Date): this {
    this.data.validate = validate;
    return this;
  }

  setInsurance(insurance: Insurance): this {
    this.data.insurance = insurance;
    return this;
  }

  setModality(modality: Modality): this {
    this.data.modality = modality
    return this
  }

  build(): CardInsurance {
    return new CardInsurance({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<ICardInsurance> {
    return { ...this.data };
  }
}

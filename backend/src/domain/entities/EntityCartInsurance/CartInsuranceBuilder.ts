import { ICartInsurance } from "../../@types/CartInsurance/ICartInsurance";
import { Insurance } from "../EntityInsurance/Insurance";
import { CartInsurance } from "./CartInsurance";

export class CartInsuranceBuilder {
  private data: Partial<ICartInsurance> = {};


  setCartNumber(cartNumber: string): this {
    this.data.cartNumber= cartNumber;
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

  build(): CartInsurance {
    return new CartInsurance({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<ICartInsurance> {
    return { ...this.data };
  }
}

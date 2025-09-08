import { IInsurance } from "../../@types/Insurance/IInsurance";
import { Specialty } from "../EntitySpecialty/Specialty";
import { Insurance } from "./Insurance";

export class InsuranceBuilder {
  private data: Partial<IInsurance> = {};


  setType(type: string): this {
    this.data.type = type;
    return this;
  }


  setSpecialties(specialties: Array<Specialty>): this {
    this.data.specialties = specialties;
    return this;
  }

  build(): Insurance {
    return new Insurance({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IInsurance> {
    return { ...this.data };
  }
}

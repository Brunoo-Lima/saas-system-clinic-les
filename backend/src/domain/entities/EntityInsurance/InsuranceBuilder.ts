import { IInsurance } from "./types/IInsurance";
import { Modality } from "../EntityModality/Modality";
import { Specialty } from "../EntitySpecialty/Specialty";
import { Insurance } from "./Insurance";

export class InsuranceBuilder {
  private data: Partial<IInsurance> = {};


  setName(name?: string): this {
    this.data.name = name;
    return this;
  }


  setSpecialties(specialties?: Array<Specialty>): this {
    this.data.specialties = specialties;
    return this;
  }

  setModalities(modalities?: Array<Modality>): this {
    this.data.modalities = modalities
    return this
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

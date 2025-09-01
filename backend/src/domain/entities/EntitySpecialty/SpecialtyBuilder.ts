import { ISpecialty } from "../../@types/Specialty/ISpecialty";
import { Specialty } from "./Specialty";


export class SpecialtyBuilder {
  private data: Partial<ISpecialty> = {};

  setName(name: string): this {
    this.data.name = name;
    return this;
  }

  setPrice(price: number): this {
    this.data.price =price;
    return this;
  }

  build(): Specialty {
    return new Specialty({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<ISpecialty> {
    return { ...this.data };
  }
}

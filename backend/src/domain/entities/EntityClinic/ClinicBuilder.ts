import { IInsurance } from '../EntityInsurance/types/IInsurance';
import { Clinic } from './Clinic';
import { IClinic } from './types/IClinic';

export class ClinicBuilder {
  private data: Partial<IClinic> = {};

  setName(name: typeof this.data.name): this {
    this.data.name = name;
    return this;
  }

  setInsurances(insurances: typeof this.data.insurances): this {
    this.data.insurances = insurances;
    return this;
  }

  setTimeToConfirm(timeToConfirm: typeof this.data.timeToConfirmScheduling): this {
    this.data.timeToConfirmScheduling = timeToConfirm;
    return this;
  }

  setSpecialties(specialties: typeof this.data.specialties): this {
    this.data.specialties = specialties;
    return this;
  }
  setPhone(phone: typeof this.data.phone): this {
    this.data.phone = phone;
    return this;
  }

  setCNPJ(cnpj: typeof this.data.cnpj): this {
    this.data.cnpj = cnpj;
    return this;
  }

  setAddress(address: typeof this.data.address): this {
    this.data.address = address;
    return this;
  }

  setUser(user:  typeof this.data.user): this {
    this.data.user = user;
    return this;
  }

  build(): Clinic {
    return new Clinic({
      ...this.data, // sobrescreve defaults se vier do builder
    });
  }

  // 🔹 Método extra para retornar apenas os filtros (sem instanciar User)
  buildFilters(): Partial<IInsurance> {
    return { ...this.data };
  }
}

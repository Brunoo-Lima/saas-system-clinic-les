import { IInsurance } from '../EntityInsurance/types/IInsurance';
import { Address } from '../EntityAddress/Address';
import { Insurance } from '../EntityInsurance/Insurance';
import { Specialty } from '../EntitySpecialty/Specialty';
import { User } from '../EntityUser/User';
import { Clinic } from './Clinic';
import { IClinic } from './types/IClinic';

export class ClinicBuilder {
  private data: Partial<IClinic> = {};

  setName(name: string = ""): this {
    this.data.name = name;
    return this;
  }

  setInsurances(insurances: Array<Insurance>): this {
    this.data.insurances = insurances;
    return this;
  }

  setTimeToConfirm(timeToConfirm: string): this {
    this.data.timeToConfirmScheduling = timeToConfirm;
    return this;
  }

  setSpecialties(specialties: Array<Specialty>): this {
    this.data.specialties = specialties;
    return this;
  }
  setPhone(phone: string): this {
    this.data.phone = phone;
    return this;
  }

  setCNPJ(cnpj: string): this {
    this.data.cnpj = cnpj;
    return this;
  }

  setAddress(address: Address): this {
    this.data.address = address;
    return this;
  }

  setUser(user: User): this {
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

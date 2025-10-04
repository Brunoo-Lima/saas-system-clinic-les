import { IPatient } from "./types/IPatient";
import { Address } from "../EntityAddress/Address";
import { User } from "../EntityUser/User";
import { Patient } from "./Patient";

export class PatientBuilder {
  private data: Partial<IPatient> = {};

  setPhone(phone: string | undefined): this {
    this.data.phone = phone
    return this;
  }

  setUser(user: User | undefined): this {
    this.data.user = user;
    return this;
  }

  setCpf(cpf: string | undefined): this {
    this.data.cpf = cpf;
    return this;
  }

  setDateOfBirth(dateOfBirth?: Date | undefined): this {
    this.data.dateOfBirth = dateOfBirth;
    return this;
  }

  setName(name: string | undefined): this {
    this.data.name = name;
    return this;
  }

  setAddress(address: Address | undefined): this {
    this.data.address = address;
    return this;
  }

  setSex(sex: string | undefined): this {
    this.data.sex = sex
    return this
  }
  build(): Patient {
    return new Patient(
      this.data, // garante que todas as propriedades obrigatórias estão presentes
    );
  }


}
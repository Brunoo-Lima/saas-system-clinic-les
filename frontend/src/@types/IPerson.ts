import type { IAddress } from "./IAddress";

export enum DocumentType {
  CPF = "CPF",
  CNH = "CNH",
}

export enum Gender {
  MASCULINO = "male",
  FEMININO = "female",
}

export interface IPerson {
  name: string;
  email: string;
  typeDocument: DocumentType;
  document: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: Gender;
  address: IAddress;
}

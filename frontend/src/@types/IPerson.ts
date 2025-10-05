import type { IAddress } from './IAddress';

export type Sex = 'Male' | 'Female';

export interface IPerson {
  name: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  sex: Sex;
  address: IAddress;
}

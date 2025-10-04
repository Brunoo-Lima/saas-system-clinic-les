import type { IAddress } from './IAddress';

export type Sex = 'male' | 'female';

export interface IPerson {
  name: string;
  cpf: string;
  dateOfBirth: string;
  phone: string;
  sex: Sex;
  address: IAddress;
}

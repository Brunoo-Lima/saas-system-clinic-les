import type { IAddress } from './IAddress';

export type Gender = 'male' | 'female';

export interface IPerson {
  name: string;
  email: string;
  password?: string;
  cpf: string;
  dateOfBirth: Date;
  phoneNumber: string;
  gender: Gender;
  address: IAddress;
}

import type { IAddress } from './IAddress';

export interface IClinic {
  name: string;
  phone: string;
  cnpj: string;
  specialties: {
    id: string;
    name?: string;
    price: number;
  }[];
  insurances: {
    id: string;
    name?: string;
  }[];
  timeToConfirm: string;
  address: IAddress;
}

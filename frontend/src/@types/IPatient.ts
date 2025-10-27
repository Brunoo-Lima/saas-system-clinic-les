import type { IPerson } from './IPerson';

export type IModality =
  | 'enfermaria'
  | 'executivo'
  | 'empresarial'
  | 'apartamento';

export interface IPatient extends IPerson {
  id: string;
  user: IUserPerson;
  cardInsurances: ICardInsurance[];
}

export interface ICardInsurance {
  insurance: {
    id: string;
  };
  cardInsuranceNumber: string;
  validate: string;
  modality: {
    id: string;
  };
}

export interface IUserPerson {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

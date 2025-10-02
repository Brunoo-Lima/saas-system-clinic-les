import type { IPerson } from './IPerson';

export type IModality =
  | 'enfermaria'
  | 'executivo'
  | 'empresarial'
  | 'apartamento';

export interface IPatient extends IPerson {
  id: number;
  hasInsurance?: boolean;
  insurance?: {
    name: string;
    number: string;
    modality: IModality;
    validate: string;
  };
}

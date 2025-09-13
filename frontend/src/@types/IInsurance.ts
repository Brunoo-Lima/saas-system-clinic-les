import type { ISpecialty } from './ISpecialty';

export interface IInsurance {
  id: number;
  name: string;
  specialties: ISpecialty[];
  description: string;
}

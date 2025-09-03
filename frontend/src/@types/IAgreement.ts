import type { ISpecialty } from "./ISpecialty";

export interface IAgreement {
  id: number;
  name: string;
  specialties: ISpecialty[];
  description: string;
}

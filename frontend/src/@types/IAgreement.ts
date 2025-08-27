export interface IAgreement {
  id: number;
  name: string;
  specialties: ISpecialty[];
  description: string;
}

export interface ISpecialty {
  id: number;
  name: string;
  slug: string;
}

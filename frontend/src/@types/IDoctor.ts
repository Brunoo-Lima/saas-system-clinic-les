import type { IPerson } from './IPerson';

export interface IDoctor extends IPerson {
  id: number;
  crm: string;
  servicePriceInCents: number;
  specialties: ISpecialtyDoctor[];
  status: boolean;
  createUser: boolean;
  justification?: string;
}

export interface ISpecialtyDoctor {
  specialty: string;
  availableWeekDay: DayAvailability[];
}

export interface DayAvailability {
  day: string; // ex: "1" para segunda, "2" para terça etc
  intervals: TimeInterval[];
}

export interface TimeInterval {
  from: string;
  to: string;
}

export type Availability = DayAvailability[];

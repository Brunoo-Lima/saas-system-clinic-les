import type { IPerson } from "./IPerson";

export interface IDoctor extends IPerson {
  id: number;
  specialty: string;
  crm: string;
  servicePriceInCents: number;
  availableWeekDay: DayAvailability[];
  status: boolean;
  justification?: string;
}

export interface TimeInterval {
  from: string;
  to: string;
}

export interface DayAvailability {
  day: string; // ex: "1" para segunda, "2" para terça etc
  intervals: TimeInterval[];
}

export type Availability = DayAvailability[];

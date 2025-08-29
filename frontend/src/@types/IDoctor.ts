import type { IPerson } from "./IPerson";

export interface IDoctor extends IPerson {
  id: number;
  specialty: string;
  crm: string;
  servicePriceInCents: number;
  availableWeekDay: string[];
  availableTime: string[];
  status: boolean;
  justification?: string;
}

import type { IPerson } from './IPerson';

export interface IDoctor extends IPerson {
  id: string;
  crm: string;
  percentDistribution: number;
  specialties: {
    id: string;
    name: string;
    percentDistribution: number;
  }[];
  user: IUserPerson;
  periodToWork: {
    dayWeek: number;
    timeFrom: string;
    timeTo: string;
    specialty_id: string;
  }[];
}

export interface IUserPerson {
  email: string;
  username: string;
  password: string;
  id?: string;
}

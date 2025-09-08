import { IAddress } from "./IAddress";

export interface IAppointment {
  id: number;
  date: string;
  time: string;
  doctor: string;
  status: string;
  address: IAddress;
}

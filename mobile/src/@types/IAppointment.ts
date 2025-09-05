import { IAddress } from "./IAddress";

export interface IAppointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  status: string;
  address: IAddress;
}

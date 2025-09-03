export interface IAppointment {
  id: number;
  date: Date;
  specialty: {
    id: string;
    name: string;
    price: number;
  };
  appointmentPriceInCents: number;
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: string;
  };
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
  clinic: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

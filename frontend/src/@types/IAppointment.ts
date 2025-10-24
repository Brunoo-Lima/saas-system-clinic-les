export interface IAppointment {
  id: string;
  date: Date | string;
  hour: string;
  priceOfConsultation: number;
  isReturn?: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'CONCLUDE' | 'CANCELED' | string;
  doctor: {
    id: string;
  };
  patient: {
    id: string;
  };
  insurance: {
    id: string;
  };
  specialty: {
    id: string;
  };
}

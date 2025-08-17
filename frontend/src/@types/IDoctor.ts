export interface IDoctor {
  id: number;
  name: string;
  specialty: string;
  appointmentPriceInCents: number;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
  sex: string;
}

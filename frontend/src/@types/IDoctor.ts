export interface IDoctor {
  id: number;
  name: string;
  specialty: string;
  servicePriceInCents: number;
  availableFromWeekDay: number;
  availableToWeekDay: number;
  availableFromTime: string;
  availableToTime: string;
  sex: string;
}

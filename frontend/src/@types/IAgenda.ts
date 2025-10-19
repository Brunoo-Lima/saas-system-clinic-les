export interface IBlockedDate {
  date: string; // Formato "YYYY-MM-DD"
  reason: string;
}

export interface IAvailabilitySettings {
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  blockedDates: IBlockedDate[];
}

export interface IAgendaRequest {
  dateFrom: string; // Formato "YYYY-MM-DD"
  dateTo: string; // Formato "YYYY-MM-DD"
  doctor: {
    id: string;
  };
  datesBlocked?: IBlockedDate[]; // Opcional
}

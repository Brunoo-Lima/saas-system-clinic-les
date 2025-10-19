import type { IBlockedDate } from '@/@types/IAgenda';

export const formatDateToBackend = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseBackendDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00');
};

export const convertToBackendBlockedDates = (dates: Date[]): IBlockedDate[] => {
  return dates.map((date) => ({
    date: formatDateToBackend(date),
    reason: 'Data bloqueada pelo médico',
  }));
};

export const convertFromBackendBlockedDates = (
  blockedDates: IBlockedDate[],
): Date[] => {
  return blockedDates.map((blocked) => parseBackendDate(blocked.date));
};

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
    reason: 'Data bloqueada',
  }));
};

export const convertFromBackendBlockedDates = (
  blockedDates: IBlockedDate[],
): Date[] => {
  return blockedDates.map((blocked) => parseBackendDate(blocked.date));
};

export const formatDateToBackendRobust = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    throw new Error('Data inválida fornecida');
  }

  let dateObj: Date;

  // Se já for um objeto Date
  if (date instanceof Date) {
    dateObj = date;
  }
  // Se for string, converte para Date
  else if (typeof date === 'string') {
    dateObj = new Date(date);

    // Verifica se a conversão foi bem sucedida
    if (isNaN(dateObj.getTime())) {
      throw new Error('Formato de data inválido');
    }
  }
  // Outros tipos não suportados
  else {
    throw new Error('Tipo de data não suportado');
  }

  return dateObj.toISOString().split('T')[0];
};

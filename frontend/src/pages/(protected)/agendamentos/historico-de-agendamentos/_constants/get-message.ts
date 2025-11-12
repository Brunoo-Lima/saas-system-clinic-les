export const statusClasses: Record<string, string> = {
  PENDING:
    'bg-yellow-500 text-yellow-100 dark:bg-yellow-600/60 dark:text-yellow-200',
  CONCLUDE:
    'bg-green-500 text-green-100 dark:bg-green-600/60 dark:text-green-200',
  CANCELED: 'bg-red-500 text-red-100 dark:bg-red-600/60 dark:text-red-200',
  CONFIRMED: 'bg-blue-500 text-blue-100 dark:bg-blue-600/60 dark:text-blue-200',
  CANCEL_PENDING:
    'bg-pink-500 text-pink-100 dark:bg-pink-600/60 dark:text-pink-200',
  default: 'bg-gray-500 text-gray-100 dark:bg-gray-600/60 dark:text-gray-200',
};

export const getStatus = (status: string) => {
  return statusClasses[status] || statusClasses.default;
};

export const getStatusUi: Record<string, string> = {
  CANCELED: 'Cancelada',
  CONCLUDE: 'Realizada',
  PENDING: 'Agendada',
  CONFIRMED: 'Confirmada',
  CANCEL_PENDING: 'Cancelamento solicitado',
};

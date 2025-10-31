export const statusClasses: Record<string, string> = {
  scheduled:
    'bg-yellow-500 text-yellow-100 dark:bg-yellow-600/60 dark:text-yellow-200',
  finished:
    'bg-green-500 text-green-100 dark:bg-green-600/60 dark:text-green-200',
  canceled: 'bg-red-500 text-red-100 dark:bg-red-600/60 dark:text-red-200',
  default: 'bg-gray-500 text-gray-100 dark:bg-gray-600/60 dark:text-gray-200',
};

export const getStatus = (status: string) => {
  return statusClasses[status] || statusClasses.default;
};

export const getStatusUi: Record<string, string> = {
  CANCELED: 'Cancelada',
  CONCLUDE: 'Realizada',
  PENDING: 'Agendada',
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

interface ISchedulingStatusProps {
  id: string;
  status: string;
  patient: {
    id: string;
  };
}

export const updateStatusScheduling = async ({
  id,
  status,
  patient,
}: ISchedulingStatusProps) => {
  const { data } = await api.patch('/scheduling/status', {
    id,
    status,
    patient,
  });

  return data;
};

export const useUpdateStatusScheduling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusScheduling,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', variables.patient.id],
      });
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Erro ao cancelar agendamento';

      throw new Error(message);
    },
  });
};

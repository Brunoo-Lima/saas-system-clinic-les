import type { IClinic } from '@/@types/IClinic';
import api from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createClinic = async (clinic: IClinic) => {
  const { data } = await api.post('/clinic', clinic);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useCreateClinic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinic,
    onSuccess: () => {
      toast.success('Clínica criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar clínica.');
    },
  });
};

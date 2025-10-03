import { toast } from 'sonner';
import api from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ICreateSpecialtyProps {
  id?: string;
  name: string;
}

export const createSpecialty = async ({ id, name }: ICreateSpecialtyProps) => {
  const { data } = await api.post('/specialty', [
    {
      id,
      name,
    },
  ]);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data;
};

export function useCreateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSpecialty,
    onSuccess: () => {
      toast.success('Especialidade criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar especialidade.');
    },
  });
}

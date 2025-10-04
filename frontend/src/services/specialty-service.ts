import { toast } from 'sonner';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export interface ISpecialtyProps {
  limit?: number;
  offset?: number;
}

export const getSpecialties = async ({
  limit = 10,
  offset = 0,
}: ISpecialtyProps) => {
  const { data } = await api.get(
    `/specialty/findall/?offset=${offset}&limit=${limit}`,
  );
  return data.data;
};

interface ISpecialty {
  id: string;
  name: string;
}

export function useGetSpecialties(params?: ISpecialtyProps) {
  return useQuery<ISpecialty[]>({
    queryKey: ['specialties', params],
    queryFn: () => getSpecialties(params || {}),
  });
}

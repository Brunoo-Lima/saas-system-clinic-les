import { toast } from 'sonner';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ISpecialtyProps {
  id?: string;
  clinicId: string;
  name: string;
  price: number;
}

export const createSpecialty = async ({
  id,
  name,
  price,
  clinicId,
}: ISpecialtyProps) => {
  const { data } = await api.post(`/clinic/${clinicId}/specialty`, [
    {
      id,
      name,
      price,
      clinicId,
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

export interface ISpecialty {
  id: string;
  name: string;
  price: number;
  clinicId: string;
}

export interface IGetSpecialtiesParams {
  limit?: number;
  offset?: number;
  clinicId: string;
}

export const getSpecialties = async ({
  limit = 10,
  offset = 0,
  clinicId,
}: IGetSpecialtiesParams) => {
  if (!clinicId) {
    throw new Error('clinicId é obrigatório para buscar especialidades');
  }

  const { data } = await api.get(
    `/clinic/${clinicId}/specialty/findall/?offset=${offset}&limit=${limit}`,
  );

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export interface ISpecialtyReturn {
  id: string;
  name: string;
  price: number;
}

export function useGetSpecialties(params: IGetSpecialtiesParams) {
  return useQuery<ISpecialty[]>({
    queryKey: ['specialties', params],
    queryFn: () => getSpecialties(params),
    enabled: !!params.clinicId,
  });
}

export const updateSpecialty = async ({
  name,
  id,
  price,
  clinicId,
}: ISpecialtyProps) => {
  const { data } = await api.put(`/clinic/${clinicId}/specialty`, [
    { name, id, price },
  ]);
  return data;
};

export function useUpdateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSpecialty,
    onSuccess: () => {
      toast.success('Especialidade atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar especialidade.');
    },
  });
}

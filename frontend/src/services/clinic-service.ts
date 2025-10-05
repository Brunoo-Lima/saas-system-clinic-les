import type { IClinic } from '@/@types/IClinic';
import api from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

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

interface IClinicProps {
  limit?: number;
  offset?: number;
  id?: string;
  user_id?: string;
  user_email?: string;
  cnpj?: string;
}
export const getClinic = async ({
  limit = 1,
  offset,
  id,
  user_id,
  user_email,
  cnpj,
}: IClinicProps) => {
  try {
    const { data } = await api.get(
      `/clinic/findall/?limit=${limit}&offset=${offset}&id=${id}&user_id=${user_id}&user_email=${user_email}&cnpj=${cnpj}`,
    );

    if (data.success === false) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(', ')
        : error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error(error.message || 'Erro desconhecido');
  }
};

import type { IUser } from '@/@types/IUser';
import api from './api';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createUserClinicService = async (user: IUser) => {
  try {
    const { data, status } = await api.post('/user', user);

    if ((status !== 200 && status !== 201) || data.success === false) {
      throw new Error(data.message);
    }

    return { data, status };
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

interface IUpdateStatus {
  id: string;
  profileCompleted: boolean;
}

export const updateStatusProfileCompleted = async ({
  id,
  profileCompleted,
}: IUpdateStatus) => {
  try {
    const { data } = await api.patch(`/user/?id=${id}`, {
      profileCompleted,
    });

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

export const useUpdateStatusProfileCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusProfileCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar perfil.');
    },
  });
};

import type { IClinic } from '@/@types/IClinic';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';
import type { IAddress } from '@/@types/IAddress';

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

interface IClinicData {
  id?: string;
  name: string;
  phone: string;
  cnpj: string;
  specialties: {
    id: string;
    name?: string;
    price: number;
  }[];
  insurances: {
    id: string;
    name?: string;
  }[];
  user: {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    username?: string;
    password?: string;
    passwordConfirmed?: string;
    avatar?: string;
    profileCompleted: boolean;
  };
  timeToConfirm: string;
  address: IAddress;
}

interface IClinicResponse {
  data: IClinicData[];
  message: string;
  success: boolean;
}

export const getClinic = async () => {
  try {
    const { data } = await api.get<IClinicResponse>(`/clinic/findall/`);

    if (!data.data.length) {
      throw new Error('Nenhuma clínica encontrada.');
    }
    return data.data[0];
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

export const useGetClinic = () => {
  return useQuery({
    queryKey: ['clinics'],
    queryFn: () => getClinic(),
  });
};

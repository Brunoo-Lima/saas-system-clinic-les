import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { IDoctor } from '@/@types/IDoctor';
import { toast } from 'sonner';

export const getDoctors = async () => {
  const { data } = await api.get('/doctor/findall');

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  });
};

export const createDoctor = async (doctor: IDoctor) => {
  const { data } = await api.post('/doctor', doctor);

  return data;
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      toast.success('Médico criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar médico.');
    },
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import type { IDoctor } from '@/@types/IDoctor';
import { toast } from 'sonner';

export const getDoctors = async () => {
  const { data } = await api.get(`/doctor/findall`);

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

export const getDoctorById = async ({ id }: { id?: string }) => {
  const { data } = await api.get(`/doctor/findall/?id=${id}`);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetDoctorById = (id?: string) => {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById({ id }),
    enabled: !!id,
    select: (data) => {
      // Se a API retorna array, pega o primeiro item
      return Array.isArray(data) ? data[0] : data;
    },
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
      toast.success('Médico criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar médico.');
    },
  });
};

interface IUpdateDoctorProps {
  id: string;
  doctor: Partial<IDoctor>;
}

export const updateDoctor = async ({ id, doctor }: IUpdateDoctorProps) => {
  const { data } = await api.patch(`/doctor/?id=${id}`, doctor);

  return data;
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      toast.success('Médico atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar médico.');
    },
  });
};

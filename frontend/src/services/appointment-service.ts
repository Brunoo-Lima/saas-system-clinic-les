import type { IAppointment } from '@/@types/IAppointment';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createAppointmentService = async (appointment: IAppointment) => {
  const { data } = await api.post('/scheduling', appointment);
  return data;
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointmentService,
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar agendamento.');
    },
  });
};

interface IAppointmentGet {
  scheduling_id?: string;
  scheduling_date?: string;
}

export const getAppointmentService = async ({
  scheduling_id,
  scheduling_date,
}: IAppointmentGet) => {
  const { data } = await api.get(
    `/scheduling/findall/?scheduling_id=${scheduling_id}&scheduling_date=${scheduling_date}`,
  );

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetAppointments = (params?: IAppointmentGet) => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAppointmentService(params || {}),
  });
};

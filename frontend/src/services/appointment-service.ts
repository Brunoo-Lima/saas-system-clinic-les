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
  doctor_id?: string;
}

export interface IAppointmentReturn {
  id: string;
  date: string;
  dateOfRealizable: string | null;
  dateOfConfirmation: string;
  status: string;
  isReturn: boolean;
  priceOfConsultation: number;
  timeOfConsultation: string;
  specialties: {
    id: string;
    name: string;
  };
  patient: {
    id: string;
    name: string;
    cpf: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
    phone: string;
    email: string;
  };
  doctor: {
    id: string;
    name: string;
    crm: string;
    cpf: string;
    sex: 'Male' | 'Female';
    dateOfBirth: string;
  };
}

export const getAppointmentService = async ({
  scheduling_id,
  scheduling_date,
  doctor_id,
}: IAppointmentGet) => {
  const { data } = await api.get('/scheduling/findall', {
    params: {
      scheduling_id,
      scheduling_date,
      doctor_id,
    },
  });

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetAppointments = (params?: IAppointmentGet) => {
  return useQuery<IAppointmentReturn[]>({
    queryKey: ['appointments', params],
    queryFn: () => getAppointmentService(params || {}),
  });
};

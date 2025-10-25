import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface IAppointmentPayload {
  date: string;
  hour: string;
  priceOfConsultation: number;
  isReturn?: boolean;
  status: 'CONFIRMED' | 'PENDING' | 'CONCLUDE' | 'CANCELED' | string;
  doctor: {
    id: string;
  };
  patient: {
    id: string;
  };
  insurance?: {
    id: string;
  };
  specialty: {
    id: string;
  };
}

export const createAppointmentService = async (
  appointment: IAppointmentPayload,
) => {
  const { data } = await api.post('/scheduling', appointment);

  if (!data.success) {
    throw new Error(data.message);
  }

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
  status: string;
  isReturn: boolean;
  priceOfConsultation: number;
  specialties?: {
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
  insurance: {
    id: string;
    name: string;
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

interface IUpdateAppointment {
  id: string;
  appointment: IAppointmentPayload;
}

export const updateAppointmentService = async ({
  id,
  appointment,
}: IUpdateAppointment) => {
  const { data } = await api.patch(`/scheduling/?id=${id}`, appointment);

  if (data.success === false) {
    throw new Error(data.message || 'Erro ao atualizar agendamento.');
  }
  return data;
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointmentService,
    onSuccess: () => {
      toast.success('Agendamento atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar agendamento.');
    },
  });
};

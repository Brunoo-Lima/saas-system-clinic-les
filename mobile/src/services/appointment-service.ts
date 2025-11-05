import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface IAppointmentGet {
  scheduling_id?: string;
  scheduling_date?: string;
  doctor_id?: string;
  user_id?: string;
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
  user_id,
}: IAppointmentGet) => {
  const { data } = await api.get('/scheduling/findall', {
    params: {
      scheduling_id,
      scheduling_date,
      doctor_id,
      user_id,
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

interface IAppointmentPayload {
  id: string;
  doctor: {
    id: string;
  };
}
export const requestCancelAppointment = async ({
  id,
  doctor,
}: IAppointmentPayload) => {
  const { data } = await api.patch(`/scheduling/cancel`, {
    id,
    doctor,
  });

  return data;
};

export const useRequestCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestCancelAppointment,

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
      queryClient.invalidateQueries({
        queryKey: ['appointments', variables.doctor.id],
      });

      console.log('Agendamento cancelado com sucesso:', data);
    },

    onError: (error: any) => {
      console.error('Erro ao cancelar agendamento:', error);

      const message =
        error.response?.data?.message ||
        error.message ||
        'Erro ao cancelar agendamento';

      throw new Error(message);
    },
  });
};

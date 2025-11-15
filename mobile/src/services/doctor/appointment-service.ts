import api from '../api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface IAppointmentGet {
  scheduling_id?: string;
  scheduling_date?: string;
  doctor_id?: string;
  patient_id?: string;
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
  patient_id,
}: IAppointmentGet) => {
  const { data } = await api.get('/scheduling/findall', {
    params: {
      scheduling_id,
      scheduling_date,
      doctor_id,
      patient_id,
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
  status: string;
  doctor: {
    id: string;
    cpf?: string;
  };
}
export const updateStatusSchedulingDoctor = async ({
  id,
  status,
  doctor,
}: IAppointmentPayload) => {
  const { data } = await api.patch('/scheduling/status', {
    id,
    status,
    doctor: {
      id: doctor.id,
      cpf: doctor.cpf,
    },
  });

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data;
};

export const useUpdateStatusSchedulingDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatusSchedulingDoctor,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
    },

    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Erro ao atualizar status';

      throw new Error(message);
    },
  });
};

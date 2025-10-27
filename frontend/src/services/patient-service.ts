import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { toast } from 'sonner';
import type { IAddress } from '@/@types/IAddress';

export interface IUserPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface IInsurancePayload {
  id: string;
  name?: string; // pode ser opcional, já que o ID é obrigatório
}

export interface IModalityPayload {
  id: string;
}

export interface ICardInsurancePayload {
  insurance: IInsurancePayload;
  cardInsuranceNumber: string;
  validate: string; // YYYY-MM-DD
  modality: IModalityPayload;
}

export interface IPatientPayload {
  user: IUserPayload;
  name: string;
  sex: 'Male' | 'Female';
  dateOfBirth: string; // YYYY-MM-DD
  cpf: string;
  phone: string;
  cardInsurances: ICardInsurancePayload[];
  address: IAddress;
  id?: string;
}

export const createPatient = async (patient: IPatientPayload) => {
  const { data } = await api.post('/patient', patient);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data;
};

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      toast.success('Paciente criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar paciente.');
    },
  });
}

interface IPatientProps {
  offset?: number;
  limit?: number;
}

export const getPatients = async ({
  limit = 10,
  offset = 0,
}: IPatientProps) => {
  const { data } = await api.get(
    `/patient/findall/?limit=${limit}&offset=${offset}`,
  );

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetAllPatients = (params?: IPatientProps) => {
  return useQuery<IPatientPayload[]>({
    queryKey: ['patients'],
    queryFn: () => getPatients(params || {}),
  });
};

interface IUpdatePatientProps {
  id: string;
  patient: Partial<IPatientPayload>;
}

export const updatePatient = async ({ id, patient }: IUpdatePatientProps) => {
  const { data } = await api.patch(`/patient/?id=${id}`, patient);
  return data;
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatient,
    onSuccess: () => {
      toast.success('Paciente atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar paciente.');
    },
  });
};

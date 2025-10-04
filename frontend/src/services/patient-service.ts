import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { toast } from 'sonner';

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

export interface ICityPayload {
  id?: string;
  name?: string;
}

export interface IStatePayload {
  id?: string;
  name?: string;
  uf?: string;
}

export interface ICountryPayload {
  id?: string;
  name?: string;
}

export interface IAddressPayload {
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  cep: string;
  city: ICityPayload;
  state: IStatePayload;
  country: ICountryPayload;
}

export interface IPatientPayload {
  user: IUserPayload;
  name: string;
  sex: 'Male' | 'Female' | 'Other';
  dateOfBirth: string; // YYYY-MM-DD
  cpf: string;
  phone: string;
  cardInsurances: ICardInsurancePayload[];
  address: IAddressPayload;
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

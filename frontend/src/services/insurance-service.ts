import { toast } from 'sonner';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface InsuranceProps {
  name: string;
  modalities: {
    name: string;
  }[];
  specialties: {
    id: string;
    price: number;
    amountTransferred: number;
  }[];
}

export const createInsurance = async ({
  name,
  modalities,
  specialties,
}: InsuranceProps) => {
  const { data, status } = await api.post('/insurance', {
    name,
    modalities,
    specialties,
  });

  if (status !== 200 || data.success === false) {
    throw new Error(data.message);
  }

  return { data, status };
};

export function useCreateInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInsurance,
    onSuccess: () => {
      toast.success('Convênio criado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['insurances'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar convênio.');
    },
  });
}

export interface IInsuranceProps {
  limit?: number;
  offset?: number;
}

export const getAllInsurances = async ({
  limit = 10,
  offset = 0,
}: IInsuranceProps) => {
  const { data } = await api.get(
    `/insurance/findall/?limit=${limit}&offset=${offset}`,
  );

  return data.data;
};

interface Insurance {
  id: string;
  name: string;
  modalities: {
    id: string;
    name: string;
  }[];
  specialties: {
    id: string;
    price: number;
    amountTransferred: number;
  }[];
}

export function useGetAllInsurances(params?: IInsuranceProps) {
  return useQuery<Insurance[]>({
    queryKey: ['insurances'],
    queryFn: () => getAllInsurances(params || {}),
  });
}

interface IUpdateInsurance {
  id: string;
  insurance: Omit<Partial<Insurance>, 'id'> & {
    modalities?: { id?: string; name: string }[];
  };
}

export const updateInsurance = async ({ id, insurance }: IUpdateInsurance) => {
  const { data: response, status } = await api.patch(
    `/insurance/?id=${id}`,
    insurance,
  );

  if (status !== 200 || response.success === false) {
    throw new Error(response.message);
  }

  return { data: response.data, status };
};

export function useUpdateInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInsurance,
    onSuccess: () => {
      toast.success('Convênio atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['insurances'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar convênio.');
    },
  });
}

import { toast } from 'sonner';
import api from './api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ICreateInsuranceProps {
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

export const createInsurance = async ({
  name,
  modalities,
  specialties,
}: ICreateInsuranceProps) => {
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

import type { IAgendaRequest } from '@/@types/IAgenda';
import api from './api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const createAgendaService = async (agenda: IAgendaRequest) => {
  const { data } = await api.post('/doctor/scheduling', agenda);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data;
};

export const useCreateAgenda = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgendaService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao criar agenda.');
    },
  });
};

interface IAgendaDoctor {
  id: string;
  dateFrom: string; // Formato "YYYY-MM-DD"
  dateTo: string; // Formato "YYYY-MM-DD"
  isActivate: boolean;
  periodToWork: {
    id: string;
    dayWeek: number;
    timeFrom: string;
    timeTo: string;
    specialty: {
      id: string;
      name: string;
    };
  }[];
  datesBlocked?: {
    id?: string;
    dateBlocked: string;
    reason: string;
  }[];
}

export const getAgendaService = async (doctorId: string) => {
  const { data } = await api.get(
    `/doctor/scheduling/findall/?doctor_id=${doctorId}`,
  );

  return data.data;
};

export const useGetAgenda = (doctorId: string) => {
  return useQuery<IAgendaDoctor[]>({
    queryKey: ['agenda', doctorId],
    queryFn: () => getAgendaService(doctorId),
    enabled: !!doctorId,
  });
};

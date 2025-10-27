import type { IAgendaRequest, IAgendaReturn } from '@/@types/IAgenda';
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

export interface IAgendaDoctor {
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

export const updateAgendaService = async (
  doctorId: string,
  agenda: Partial<IAgendaReturn>,
) => {
  try {
    const { data } = await api.patch(
      `/doctor/scheduling/?id=${doctorId}`,
      agenda,
    );

    if (!data.success) {
      throw new Error(data.message || 'Erro ao atualizar agenda.');
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Erro ao atualizar agenda.',
    );
  }
};

export const useUpdateAgenda = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      doctorId,
      agenda,
    }: {
      doctorId: string;
      agenda: Partial<IAgendaReturn>;
    }) => updateAgendaService(doctorId, agenda),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      toast.success('Agenda atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao atualizar agenda.');
    },
  });
};

export interface IAddPeriodsAgendaProps {
  id: string;
  periodToWork: {
    dayWeek: number;
    timeFrom: string;
    timeTo: string;
    specialty_id: string;
  }[];
}

export const addPeriodsAgenda = async ({
  id,
  periodToWork,
}: IAddPeriodsAgendaProps) => {
  const { data } = await api.post('/doctor/periods/add', { id, periodToWork });

  return data;
};

export const useAddPeriodsAgenda = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPeriodsAgenda,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
      toast.success('Período adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao adicionar período.');
    },
  });
};

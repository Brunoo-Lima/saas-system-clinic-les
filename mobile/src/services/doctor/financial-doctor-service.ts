import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const getFinancialDoctor = async (doctorId: string) => {
  const { data } = await api.get(`/doctor/${doctorId}/financial`);

  return data.data;
};

export const useGetFinancialDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['financial'],
    queryFn: () => getFinancialDoctor(doctorId),
  });
};

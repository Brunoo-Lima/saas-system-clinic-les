import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const getFinancialDoctor = async (userId: string) => {
  const { data } = await api.get(`/doctor/${userId}/financial`);

  return data.data;
};

export const useGetFinancialDoctor = (userId: string) => {
  return useQuery({
    queryKey: ['financial'],
    queryFn: () => getFinancialDoctor(userId),
  });
};

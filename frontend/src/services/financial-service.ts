import { useQuery } from '@tanstack/react-query';
import api from './api';

interface IFinancial {
  totalclinic: number;
  total: number;
  totaldoctor: number;
  totalinsurance: number;
}

export const getFinancialService = async () => {
  const { data } = await api.get('/financial/findall');

  return data.data;
};

export const useGetFinancialService = () => {
  return useQuery<IFinancial[]>({
    queryKey: ['financials'],
    queryFn: getFinancialService,
  });
};

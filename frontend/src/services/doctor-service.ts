import { useQuery } from '@tanstack/react-query';
import api from './api';

export const getDoctors = async () => {
  const { data } = await api.get('/doctor/findall');

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: () => getDoctors(),
  });
};

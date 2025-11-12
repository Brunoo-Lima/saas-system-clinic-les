import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const getPatientById = async ({ user_id }: { user_id?: string }) => {
  const { data } = await api.get(`/patient/findall/?user_id=${user_id}`);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetPatientById = (user_id?: string) => {
  return useQuery({
    queryKey: ['patient', user_id],
    queryFn: () => getPatientById({ user_id }),
    enabled: !!user_id,
    select: (data) => {
      return Array.isArray(data) ? data[0] : data;
    },
  });
};

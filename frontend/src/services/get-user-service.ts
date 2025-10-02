import { useMutation } from '@tanstack/react-query';
import api from './api';

export const getUser = async (email: string) => {
  const { data } = await api.post('/user/find', { email });

  return data;
};

export function useGetUser() {
  return useMutation({
    mutationFn: ({ email }: { email: string }) => getUser(email),
  });
}

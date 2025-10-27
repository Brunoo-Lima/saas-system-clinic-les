import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { toast } from 'sonner';

export const resetPasswordUser = async (id: string) => {
  const { data } = await api.patch('/user/password/reset', { id });

  return data;
};

export const usePasswordUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPasswordUser,
    onSuccess: () => {
      toast.success('Nova senha enviada para o email do usuário!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar senha.');
    },
  });
};

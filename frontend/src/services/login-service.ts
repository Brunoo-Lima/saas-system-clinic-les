import axios from 'axios';
import api from './api';

interface ILoginServiceProps {
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'patient';
}

export const loginService = async ({
  email,
  password,
  role,
}: ILoginServiceProps) => {
  try {
    const response = await api.post('/auth', {
      email,
      password,
      role,
    });

    // Lê o token dentro de data.data.token ou data.token
    const token = response.data?.token || response.data?.data?.token;

    if (!token) {
      throw new Error('Erro ao autenticar usuário');
    }

    return { token, data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response?.data?.message.join(', ')
        : error.response?.data?.message || error.message;
      throw new Error(message);
    }
    throw new Error(error.message || 'Erro desconhecido');
  }
};

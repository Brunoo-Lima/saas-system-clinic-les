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

    const { token, user } = response.data.data;

    return { token, user };
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

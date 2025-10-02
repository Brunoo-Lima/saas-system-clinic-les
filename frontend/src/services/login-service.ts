import axios from 'axios';
import api from './api';

interface ILoginServiceProps {
  email: string;
  password: string;
  role: 'admin' | 'doctor' | 'patient';
}

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
    const { data, status } = await api.post('/auth', { email, password, role });

    if (status !== 200 || data.success === false) {
      const message = Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message || 'Erro desconhecido';
      throw new Error(message);
    }

    return data;
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

import type { IUser } from '@/@types/IUser';
import api from './api';
import axios from 'axios';

export const createUserService = async (user: IUser) => {
  try {
    const { data, status } = await api.post('/user', { user });

    if (status !== 200 || data.success === false) {
      throw new Error(data.message);
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

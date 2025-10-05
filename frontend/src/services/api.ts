// api.ts - VERSÃO CORRIGIDA
import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const accessToken =
        sessionStorage.getItem('@user:token') ||
        localStorage.getItem('@user:token');
      if (
        accessToken &&
        !config.url?.includes('auth/local') &&
        !config.url?.includes('auth/reset-password')
      ) {
        config.headers!.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

export default api;

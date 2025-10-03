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

export default api;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest.retry) {
      originalRequest.retry = true;

      if (window) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '/';
      }

      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

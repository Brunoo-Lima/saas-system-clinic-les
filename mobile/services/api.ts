// services/api.ts
import axios from 'axios';
import { StorageService } from './storage-service';

const api = axios.create({
  baseURL: 'https://lifecare-n3is.onrender.com/',
});

api.interceptors.request.use(async (config) => {
  const token = await StorageService.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

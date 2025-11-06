import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  getDoctorById,
  useGetDoctorById,
} from '@/services/doctor/doctor-service';
import { useRouter } from 'expo-router';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface IDoctor {
  id: string;
  name: string;
  crm: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  doctor: IDoctor | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: doctorData } = useGetDoctorById(user?.id);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUser = await SecureStore.getItemAsync('userData');
      const storedDoctor = await SecureStore.getItemAsync('doctorData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedDoctor) setDoctor(JSON.parse(storedDoctor));
      }
      setLoading(false);
    };
    loadStoredData();
  }, []);

  useEffect(() => {
    if (doctorData) {
      setDoctor(doctorData);
      SecureStore.setItemAsync('doctorData', JSON.stringify(doctorData));
    }
  }, [doctorData]);

  const login = async (token: string, user: User) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
    await SecureStore.deleteItemAsync('doctorData');
    setUser(null);
    setToken(null);
    setDoctor(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{ user, doctor, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

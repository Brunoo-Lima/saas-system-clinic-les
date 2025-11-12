import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import { useRouter } from 'expo-router';
import { useGetPatientById } from '@/services/patient/patient-service';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface IPatient {
  id: string;
  name: string;
  user: User;
}

interface AuthPatientContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  patient: IPatient | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthPatientContext = createContext<AuthPatientContextType>(
  {} as AuthPatientContextType,
);

export function AuthPatientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: patientData } = useGetPatientById(user?.id);

  useEffect(() => {
    const loadStoredData = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      const storedUser = await SecureStore.getItemAsync('userData');
      const storedPatient = await SecureStore.getItemAsync('patientData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (storedPatient) setPatient(JSON.parse(storedPatient));
      }
      setLoading(false);
    };
    loadStoredData();
  }, []);

  useEffect(() => {
    if (patientData) {
      setPatient(patientData);
      SecureStore.setItemAsync('patientData', JSON.stringify(patientData));
    }
  }, [patientData]);

  const login = async (token: string, user: User) => {
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(user));
    setUser(user);
    setToken(token);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userData');
    await SecureStore.deleteItemAsync('patientData');
    setUser(null);
    setToken(null);
    setPatient(null);
    router.push('/');
  };

  return (
    <AuthPatientContext.Provider
      value={{ user, patient, token, loading, login, logout }}
    >
      {children}
    </AuthPatientContext.Provider>
  );
}

export const useAuthPatient = () => useContext(AuthPatientContext);

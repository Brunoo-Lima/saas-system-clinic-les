import { useQuery } from '@tanstack/react-query';
import api from '../api';

export interface IDoctorProfile {
  id: string;
  crm: string;
  name: string;
  cpf: string;
  sex: string;
  dateOfBirth: string;
  phone: string;
  specialties: Array<{
    id: string;
    name: string;
    percentDistribution: string;
  }>;
  periodToWork: Array<{
    id: string;
    dayWeek: number;
    timeFrom: string;
    timeTo: string;
    specialty_id: string;
  }>;
  user: {
    id: string;
    email: string;
    status: boolean;
    password: string;
    profileCompleted: boolean;
    emailVerified: boolean;
    username: string;
  };
  address: {
    id: string;
    name: string;
    street: string;
    cep: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    uf: string;
    country: string;
  };
}

export interface IDoctorGetProps {
  user_id: string;
}

export const getDoctorById = async ({ user_id }: { user_id?: string }) => {
  const { data } = await api.get(`/doctor/findall/?user_id=${user_id}`);

  if (data.success === false) {
    throw new Error(data.message);
  }

  return data.data;
};

export const useGetDoctorById = (user_id?: string) => {
  return useQuery({
    queryKey: ['doctor', user_id],
    queryFn: () => getDoctorById({ user_id }),
    enabled: !!user_id,
    select: (data) => {
      return Array.isArray(data) ? data[0] : data;
    },
  });
};

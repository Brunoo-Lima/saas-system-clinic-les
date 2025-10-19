import type { IDoctor } from '@/@types/IDoctor';
import type { DoctorFormSchema } from '@/validations/doctor-form-schema';

export const getDoctorDefaultValues = (doctor?: IDoctor): DoctorFormSchema => ({
  name: doctor?.name ?? '',
  crm: doctor?.crm ?? '',
  cpf: doctor?.cpf ?? '',
  user: {
    email: doctor?.user.email ?? '',
    password: doctor?.user.password ?? '',
    username: doctor?.user.username ?? '',
  },
  phone: doctor?.phone ?? '',
  dateOfBirth: doctor?.dateOfBirth ?? '',
  percentDistribution: doctor?.percentDistribution ?? 0,
  specialties: doctor?.specialties ?? [],
  sex: doctor?.sex ?? 'Male',
  periodToWork: doctor?.periodToWork ?? [],
  address: {
    name: doctor?.address?.name ?? '',
    cep: doctor?.address?.cep ?? '',
    street: doctor?.address?.street ?? '',
    number: doctor?.address?.number ?? '',
    neighborhood: doctor?.address?.neighborhood ?? '',
    city: {
      name: doctor?.address?.city?.name ?? '',
    },
    state: {
      name: doctor?.address?.state?.name ?? '',
      uf: doctor?.address?.state?.uf ?? '',
    },
    country: {
      name: doctor?.address?.country?.name ?? 'Brasil',
    },
  },
});

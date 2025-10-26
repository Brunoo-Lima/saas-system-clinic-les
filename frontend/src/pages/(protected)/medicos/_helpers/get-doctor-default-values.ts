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
  specialties:
    doctor?.specialties.map((s) => ({
      id: s.id,
      name: s.name,
      percentDistribution: s.percentDistribution,
    })) ?? [],
  sex: doctor?.sex ?? 'Male',
  periodToWork:
    doctor?.periodToWork?.map((period) => ({
      dayWeek: period.dayWeek,
      timeFrom: period.timeFrom,
      timeTo: period.timeTo,
      specialty_id: period.specialty_id,
    })) ?? [],
  address: {
    name: doctor?.address?.name ?? '',
    cep: doctor?.address?.cep ?? '',
    street: doctor?.address?.street ?? '',
    number: doctor?.address?.number ?? '',
    neighborhood: doctor?.address?.neighborhood ?? '',
    city: doctor?.address?.city ?? '',
    state: doctor?.address?.state ?? '',
    country: doctor?.address?.country ?? '',
    uf: doctor?.address?.uf ?? '',
  },
});

import type { IDoctor } from '@/@types/IDoctor';
import type { DoctorFormSchema } from '@/validations/doctor-form-schema';

export const getDoctorDefaultValues = (doctor?: IDoctor): DoctorFormSchema => ({
  name: doctor?.name ?? '',
  crm: doctor?.crm ?? '',
  cpf: doctor?.cpf ?? '',
  email: doctor?.email ?? '',
  phoneNumber: doctor?.phoneNumber ?? '',
  dateOfBirth: doctor?.dateOfBirth ?? new Date(),
  specialties: doctor?.specialties ?? [],
  gender: doctor?.gender ?? 'male',
  status: doctor?.status ?? true,
  createUser: doctor?.createUser ?? false,
  justification: doctor?.justification ?? '',
  address: {
    zipCode: doctor?.address?.zipCode ?? '',
    neighborhood: doctor?.address?.neighborhood ?? '',
    street: doctor?.address?.street ?? '',
    number: doctor?.address?.number ?? '',
    state: doctor?.address?.state ?? '',
    city: doctor?.address?.city ?? '',
    country: doctor?.address?.country ?? '',
  },
});

import type { IPatient } from '@/@types/IPatient';
import type { PatientFormSchema } from '@/validations/patient-form-schema';

export const getPatientDefaultValues = (
  patient?: IPatient,
): PatientFormSchema => ({
  name: patient?.name ?? '',
  user: {
    email: patient?.user.email ?? '',
    password: patient?.user.password ?? '',
    confirmPassword: patient?.user.confirmPassword ?? '',
    username: patient?.user.username ?? '',
  },
  phone: patient?.phone ?? '',
  sex: patient?.sex ?? 'Male',
  cpf: patient?.cpf ?? '',
  dateOfBirth: patient?.dateOfBirth ?? '',
  cardInsurances: patient?.cardInsurances ?? [],
  address: {
    name: patient?.address?.name ?? '',
    cep: patient?.address?.cep ?? '',
    street: patient?.address?.street ?? '',
    number: patient?.address?.number ?? '',
    neighborhood: patient?.address?.neighborhood ?? '',
    city: {
      name: patient?.address?.city?.name ?? '',
    },
    state: {
      name: patient?.address?.state?.name ?? '',
      uf: patient?.address?.state?.uf ?? '',
    },
    country: {
      name: patient?.address?.country?.name ?? 'Brasil',
    },
  },
});

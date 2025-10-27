import type { IPatient } from '@/@types/IPatient';

export const getPatientDefaultValues = (patient?: IPatient) => ({
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
    id: patient?.address?.id ?? '',
    name: patient?.address?.name ?? '',
    cep: patient?.address?.cep ?? '',
    street: patient?.address?.street ?? '',
    number: patient?.address?.number ?? '',
    neighborhood: patient?.address?.neighborhood ?? '',
    city: patient?.address?.city ?? '',
    state: patient?.address?.state ?? '',
    country: patient?.address?.country ?? 'Brasil',
    uf: patient?.address?.uf ?? '',
  },
});

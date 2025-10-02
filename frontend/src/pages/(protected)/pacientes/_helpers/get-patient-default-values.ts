import type { IPatient } from '@/@types/IPatient';
import type { PatientFormSchema } from '@/validations/patient-form-schema';

export const getPatientDefaultValues = (
  patient?: IPatient,
): PatientFormSchema => ({
  name: patient?.name ?? '',
  email: patient?.email ?? '',
  password: patient?.password ?? '',
  phoneNumber: patient?.phoneNumber ?? '',
  gender: patient?.gender ?? 'male',
  cpf: patient?.cpf ?? '',
  dateOfBirth: patient?.dateOfBirth ?? new Date(),
  hasInsurance: patient?.hasInsurance ?? false,
  insurance: {
    name: patient?.name ?? '',
    number: patient?.insurance?.number ?? '',
    modality: patient?.insurance?.modality ?? 'apartamento',
    validate: patient?.insurance?.validate ?? '',
  },
  address: patient?.address ?? {
    zipCode: patient?.address?.zipCode ?? '',
    street: patient?.address?.street ?? '',
    number: patient?.address?.number ?? '',
    neighborhood: patient?.address?.neighborhood ?? '',
    city: patient?.address?.city ?? '',
    state: patient?.address?.state ?? '',
    country: patient?.address?.country ?? 'Brasil',
  },
});

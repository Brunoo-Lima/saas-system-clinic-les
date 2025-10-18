import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

const periodToWorkSchema = z.object({
  dayWeek: z.number().min(1, 'Dia da semana é obrigatório'),
  timeFrom: z.string().min(1, 'Horário inicial obrigatório'),
  timeTo: z.string().min(1, 'Horário final obrigatório'),
  specialty_id: z.string().min(1, 'ID da especialidade é obrigatório'),
});

export const doctorFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  cpf: z.string().trim().min(1, { message: 'CPF é obrigatório.' }),
  crm: z.string().trim().min(1, { message: 'CRM é obrigatório.' }),
  sex: z.enum(['Male', 'Female']),
  phone: z.string().trim().min(1, { message: 'Telefone é obrigatório.' }),
  dateOfBirth: z.union([z.date(), z.string()]),
  percentDistribution: z.coerce.number().min(0, 'Repasse é obrigatório'),
  user: z.object({
    email: z.string().email('Email inválido'),
    username: z.string().min(1, 'Nome de usuário é obrigatório'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    avatar: z.string().optional(),
  }),
  specialties: z.array(
    z.object({
      id: z.string().min(1, 'ID da especialidade é obrigatório'),
    }),
  ),
  periodToWork: z
    .array(periodToWorkSchema)
    .min(1, { message: 'Selecione pelo menos um período de trabalho' }),
  address: addressFormSchema,
});

export type DoctorFormSchema = z.infer<typeof doctorFormSchema>;

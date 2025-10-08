import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

const timeIntervalSchema = z
  .object({
    from: z.string().min(1, 'Horário inicial obrigatório'),
    to: z.string().min(1, 'Horário final obrigatório'),
  })
  .refine((data) => data.from < data.to, {
    message: 'O horário inicial deve ser menor que o horário final',
    path: ['to'], // erro aparece no campo "to"
  });

const dayAvailabilitySchema = z.object({
  day: z.string().min(1, 'Dia da semana é obrigatório'),
  intervals: z
    .array(timeIntervalSchema)
    .min(1, 'Pelo menos um intervalo deve ser adicionado'),
});

const specialtyAvailabilitySchema = z.object({
  specialty: z.string().min(1, 'Especialidade é obrigatória'),
  availableWeekDay: z
    .array(dayAvailabilitySchema)
    .min(1, { message: 'Selecione pelo menos um dia de disponibilidade' }),
});

export const doctorFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  crm: z.string().trim().min(1, { message: 'CRM é obrigatório.' }),
  cpf: z.string().trim().min(1, { message: 'CPF é obrigatório.' }),
  user: z
    .object({
      email: z.string().email('Email inválido'),
      username: z.string().min(1, 'Nome de usuário é obrigatório'),
      password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
      confirmPassword: z.string().min(8, 'Confirmação de senha é obrigatória'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Senhas não conferem',
      path: ['confirmPassword'],
    }),
  phone: z.string().trim().min(1, { message: 'Telefone é obrigatório.' }),
  dateOfBirth: z.union([z.date(), z.string()]),
  sex: z.enum(['Male', 'Female']),
  specialties: z
    .array(specialtyAvailabilitySchema)
    .min(1, { message: 'Selecione pelo menos uma especialidade' }),
  status: z.boolean().default(true),
  justification: z.string().optional(),
  address: addressFormSchema,
});

export type DoctorFormSchema = z.infer<typeof doctorFormSchema>;

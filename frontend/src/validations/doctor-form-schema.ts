import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

// const timeIntervalSchema = z
//   .object({
//     from: z.string().min(1, 'Horário inicial obrigatório'),
//     to: z.string().min(1, 'Horário final obrigatório'),
//   })
//   .refine((data) => data.from < data.to, {
//     message: 'O horário inicial deve ser menor que o horário final',
//     path: ['to'], // erro aparece no campo "to"
//   });

// const dayAvailabilitySchema = z.object({
//   day: z.string().min(1, 'Dia da semana é obrigatório'),
//   intervals: z
//     .array(timeIntervalSchema)
//     .min(1, 'Pelo menos um intervalo deve ser adicionado'),
// });

// const specialtyAvailabilitySchema = z.object({
//   specialty: z.string().min(1, 'Especialidade é obrigatória'),
//   availableWeekDay: z
//     .array(dayAvailabilitySchema)
//     .min(1, { message: 'Selecione pelo menos um dia de disponibilidade' }),
// });

const periodToWorkSchema = z.object({
  periodType: z.string().min(1, 'Tipo de período é obrigatório'),
  dayWeek: z.number().min(1, 'Dia da semana é obrigatório'),
  timeFrom: z.string().min(1, 'Horário inicial obrigatório'),
  timeTo: z.string().min(1, 'Horário final obrigatório'),
});

export const doctorFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório.' }),
  cpf: z.string().trim().min(1, { message: 'CPF é obrigatório.' }),
  crm: z.string().trim().min(1, { message: 'CRM é obrigatório.' }),
  sex: z.enum(['Male', 'Female']),
  phone: z.string().trim().min(1, { message: 'Telefone é obrigatório.' }),
  dateOfBirth: z.union([z.date(), z.string()]),
  percentDistribution: z.number().min(0).max(100),
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

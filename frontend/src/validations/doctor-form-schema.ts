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
  password: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    .optional(),
  phoneNumber: z.string().trim().min(1, { message: 'Telefone é obrigatório.' }),
  email: z.string().trim().min(1, { message: 'E-mail é obrigatório.' }),
  dateOfBirth: z.date({ message: 'Data de nascimento é obrigatória.' }),
  gender: z.enum(['male', 'female'], { message: 'Gênero é obrigatório.' }),
  specialties: z
    .array(specialtyAvailabilitySchema)
    .min(1, { message: 'Selecione pelo menos uma especialidade' }),
  status: z.boolean().default(true),
  justification: z.string().optional(),
  address: addressFormSchema,
});

export type DoctorFormSchema = z.infer<typeof doctorFormSchema>;

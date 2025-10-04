import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

const cardInsuranceSchema = z.object({
  insurance: z.object({
    id: z.string().min(1, 'ID do convênio é obrigatório'),
    name: z.string().optional(),
  }),
  cardInsuranceNumber: z.string().min(1, 'Número da carteirinha é obrigatório'),
  validate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de validade inválida',
  }),
  modality: z.object({
    id: z.string().min(1, 'ID da modalidade é obrigatório'),
  }),
});

export const patientFormSchema = z.object({
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
  name: z.string().min(1, 'Nome é obrigatório'),
  sex: z.enum(['male', 'female']),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida',
  }),
  cpf: z.string().min(1, 'CPF é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  cardInsurances: z.array(cardInsuranceSchema).optional(),
  address: addressFormSchema,
});

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

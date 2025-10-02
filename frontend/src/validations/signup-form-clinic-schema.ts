import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

export const registerFormClinicSchema = z
  .object({
    name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
    cnpj: z
      .string()
      .trim()
      .min(1, { message: 'O CNPJ é obrigatório' })
      .max(14, { message: 'O CNPJ deve ter no máximo 14 caracteres' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'O e-mail é obrigatório' })
      .email({ message: 'O e-mail deve ser um e-mail valido' }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    confirm_password: z
      .string()
      .trim()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    address: addressFormSchema,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  });

export type RegisterFormClinicSchema = z.infer<typeof registerFormClinicSchema>;

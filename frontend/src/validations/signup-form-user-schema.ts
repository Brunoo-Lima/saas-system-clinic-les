import { z } from 'zod';

export const registerFormUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'O nome é obrigatório' })
      .max(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    gender: z.enum(['Masculino', 'Feminino'], {
      message: 'O sexo é obrigatório',
    }),
    birth_date: z.date({
      message: 'Data de nascimento é obrigatória.',
    }),
    cpf: z
      .string()
      .trim()
      .min(1, { message: 'O CPF é obrigatório' })
      .max(11, { message: 'O CPF deve ter no máximo 11 caracteres' }),
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
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'As senhas não coincidem',
    path: ['confirm_password'],
  });

export type RegisterFormUserSchema = z.infer<typeof registerFormUserSchema>;

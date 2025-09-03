import { z } from 'zod';

export const registerFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }),
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  role: z.enum(['admin', 'doctor', 'patient']),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

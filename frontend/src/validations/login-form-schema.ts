import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-mail é obrigatório' })
    .email({ message: 'E-mail inválido' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
  role: z.string(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

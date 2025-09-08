import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha precisa ter ao menos 8 caracteres"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;

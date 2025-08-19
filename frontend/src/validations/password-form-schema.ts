import { z } from "zod";

export const passwordFormSchema = z
  .object({
    password: z.string().trim().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().trim().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem ser iguais.",
    path: ["confirmPassword"],
  });

export type PasswordFormSchema = z.infer<typeof passwordFormSchema>;

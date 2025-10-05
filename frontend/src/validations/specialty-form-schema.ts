import { z } from 'zod';

export const specialtyFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do convênio é obrigatório.',
  }),
});

export type SpecialtyFormSchema = z.infer<typeof specialtyFormSchema>;

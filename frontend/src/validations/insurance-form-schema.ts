import { z } from 'zod';

export const insuranceFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do convênio é obrigatório.',
  }),
  description: z.string().trim().min(1, {
    message: 'Descrição do convênio é obrigatório.',
  }),
  specialties: z
    .array(z.object({ slug: z.string(), name: z.string() }))
    .min(1, {
      message: 'Especialidades do convênio é obrigatório.',
    }),
});

export type InsuranceFormSchema = z.infer<typeof insuranceFormSchema>;

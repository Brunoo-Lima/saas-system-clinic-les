import { z } from 'zod';

export const insuranceFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do convênio é obrigatório.',
  }),
  modalities: z.array(
    z.object({
      name: z.string().min(1, 'Nome da modalidade é obrigatório'),
    }),
  ),
  specialties: z.array(
    z.object({
      price: z.coerce.number().min(0, 'Preço deve ser maior que 0'),
      amountTransferred: z.coerce.number().min(0, 'Valor deve ser maior que 0'),
    }),
  ),
});

export type InsuranceFormSchema = z.infer<typeof insuranceFormSchema>;

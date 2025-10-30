import { z } from 'zod';

export const specialtyFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do convênio é obrigatório.',
  }),
  price: z.coerce.number().min(0, 'Preço deve ser maior que 0'),
});

export type SpecialtyFormSchema = z.infer<typeof specialtyFormSchema>;

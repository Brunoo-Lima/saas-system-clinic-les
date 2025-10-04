import { z } from 'zod';

export const addressFormSchema = z.object({
  name: z.string().min(1, 'Nome do endereço é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  cep: z.string().min(1, 'CEP é obrigatório'),
  city: z.object({
    name: z.string().optional(),
  }),
  state: z.object({
    name: z.string().optional(),
    uf: z.string().optional(),
  }),
  country: z.object({
    name: z.string().optional(),
  }),
});

export type AddressFormSchema = z.infer<typeof addressFormSchema>;

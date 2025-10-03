import { z } from 'zod';

export const addressFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do endereço é obrigatório.',
  }),
  street: z.string().trim().min(1, {
    message: 'Rua é obrigatória.',
  }),
  number: z.string().trim().min(1, {
    message: 'Número é obrigatório.',
  }),
  neighborhood: z.string().trim().min(1, {
    message: 'Bairro é obrigatório.',
  }),
  cep: z.string().trim().min(1, {
    message: 'CEP é obrigatório.',
  }),
  city: z.object({
    name: z.string().trim().min(1, {
      message: 'Cidade é obrigatória.',
    }),
  }),
  state: z.object({
    name: z.string().trim().min(1, {
      message: 'Nome do estado é obrigatório.',
    }),
    uf: z.string().trim().length(2, {
      message: 'UF deve ter 2 caracteres.',
    }),
  }),
  country: z.object({
    name: z.string().trim().min(1, {
      message: 'País é obrigatório.',
    }),
  }),
});

export type AddressFormSchema = z.infer<typeof addressFormSchema>;

import { z } from 'zod';

export const addressFormSchema = z.object({
  name: z.string().min(1, 'Nome do endereço é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  cep: z.string().min(1, 'CEP é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  uf: z.string().min(1, 'UF é obrigatória'),
  country: z.string().min(1, 'País é obrigatório'),
});

export type AddressFormSchema = z.infer<typeof addressFormSchema>;

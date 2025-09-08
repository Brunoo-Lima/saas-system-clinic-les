import { z } from "zod";

export const addressFormSchema = z.object({
  zipCode: z.string().trim().min(1, {
    message: "CEP é obrigatório.",
  }),
  street: z.string().trim().min(1, {
    message: "Rua é obrigatório.",
  }),
  number: z.string().trim().min(1, {
    message: "Número é obrigatório.",
  }),
  neighborhood: z.string().trim().min(1, {
    message: "Bairro é obrigatório.",
  }),
  city: z.string().trim().min(1, {
    message: "Cidade é obrigatória.",
  }),
  state: z.string().trim().min(1, {
    message: "Estado é obrigatório.",
  }),
  country: z.string().trim().min(1, {
    message: "País é obrigatório.",
  }),
});

export type AddressFormSchema = z.infer<typeof addressFormSchema>;

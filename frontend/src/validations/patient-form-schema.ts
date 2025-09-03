import { z } from "zod";
import { addressFormSchema } from "./address-form-schema";

export const patientFormSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  agreement: z.string().trim().min(1, {
    message: "Convênio é obrigatório.",
  }),
  cpf: z.string().trim().min(1, {
    message: "CPF é obrigatório.",
  }),
  dateOfBirth: z.date({
    message: "Data de nascimento é obrigatória.",
  }),
  phoneNumber: z.string().trim().min(1, {
    message: "Número de telefone é obrigatório.",
  }),
  gender: z.enum(["male", "female"], {
    message: "Gênero é obrigatório.",
  }),
  address: addressFormSchema,
});

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

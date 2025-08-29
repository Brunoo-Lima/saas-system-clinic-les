import { z } from "zod";
import { addressFormSchema } from "./address-form-schema";

export const doctorFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
  specialty: z
    .string()
    .trim()
    .min(1, { message: "Especialidade é obrigatória." }),
  crm: z.string().trim().min(1, { message: "CRM é obrigatório." }),
  typeDocument: z.enum(["CPF", "CNH"], { message: "Tipo é obrigatório." }),
  document: z.string().trim().min(1, { message: "Documento é obrigatório." }),
  phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório." }),
  email: z.string().trim().min(1, { message: "E-mail é obrigatório." }),
  dateOfBirth: z.string({ message: "Data de nascimento é obrigatória." }),
  gender: z.enum(["male", "female"], { message: "Gênero é obrigatório." }),
  priceService: z
    .number()
    .min(1, { message: "Preço do serviço é obrigatório." }),
  availableWeekDay: z.array(z.string()).min(1, {
    message: "Dia da semana é obrigatório.",
  }),
  availableTime: z
    .array(z.string())
    .min(1, { message: "Hora de disponibilidade é obrigatória." }),
  status: z.boolean().default(true),
  justification: z.string().optional(),
  address: addressFormSchema,
});
// .refine(
//   (data) => {
//     if (data.availableFromTime < data.availableToTime) {
//       return true;
//     }
//   },
//   {
//     message:
//       "O horário de início não pode ser anterior ao horário de término.",
//     path: ["availableToTime"],
//   }
// );

export type DoctorFormSchema = z.infer<typeof doctorFormSchema>;

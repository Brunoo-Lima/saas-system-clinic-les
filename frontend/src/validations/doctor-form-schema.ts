import { z } from "zod";
import { addressFormSchema } from "./address-form-schema";

const timeIntervalSchema = z.object({
  from: z.string().min(1, "Horário inicial obrigatório"),
  to: z.string().min(1, "Horário final obrigatório"),
});

const dayAvailabilitySchema = z.object({
  day: z.string().min(1, "Dia da semana é obrigatório"),
  intervals: z
    .array(timeIntervalSchema)
    .min(1, "Pelo menos um intervalo deve ser adicionado"),
});

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
  availableWeekDay: z.array(dayAvailabilitySchema).min(1, {
    message: "Selecione pelo menos um dia de disponibilidade",
  }),
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

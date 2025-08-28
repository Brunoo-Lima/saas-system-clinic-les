import { z } from "zod";

export type DoctorFormSchema = z.infer<typeof doctorFormSchema>;

export const doctorFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
    specialty: z
      .string()
      .trim()
      .min(1, { message: "Especialidade é obrigatória." }),
    priceService: z
      .number()
      .min(1, { message: "Preço do serviço é obrigatório." }),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z
      .string()
      .min(1, { message: "Hora de início é obrigatória." }),
    availableToTime: z
      .string()
      .min(1, { message: "Hora de término é obrigatória." }),
  })
  .refine(
    (data) => {
      if (data.availableFromTime < data.availableToTime) {
        return true;
      }
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    }
  );

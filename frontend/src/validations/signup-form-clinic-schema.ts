import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

export const registerFormClinicSchema = z.object({
  phone: z.string().nonempty('Telefone é obrigatório'),
  cnpj: z.string().nonempty('CNPJ é obrigatório'),
  timeToConfirm: z
    .string()
    .nonempty('Tempo de confirmação é obrigatório')
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: 'Horário inválido. Use o formato HH:mm:ss',
    }),
  address: addressFormSchema,
});

export type RegisterFormClinicSchema = z.infer<typeof registerFormClinicSchema>;

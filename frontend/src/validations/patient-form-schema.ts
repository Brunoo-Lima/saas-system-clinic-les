import { z } from 'zod';
import { addressFormSchema } from './address-form-schema';

const insuranceSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Nome do convênio é obrigatório.',
  }),
  number: z
    .string()
    .min(3, 'O número da carteirinha deve ter pelo menos 3 caracteres')
    .max(50, 'O número da carteirinha deve ter no máximo 50 caracteres'),
  validate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de validade inválida',
  }),
  modality: z
    .enum(['enfermaria', 'apartamento', 'executivo', 'empresarial'])
    .optional(),
});

export const patientFormSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: 'Nome é obrigatório.',
    }),
    email: z.string().email({
      message: 'Email inválido.',
    }),
    password: z
      .string()
      .trim()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
      .optional(),
    cpf: z.string().trim().min(1, {
      message: 'CPF é obrigatório.',
    }),
    dateOfBirth: z.date({
      message: 'Data de nascimento é obrigatória.',
    }),
    phoneNumber: z.string().trim().min(1, {
      message: 'Número de telefone é obrigatório.',
    }),
    gender: z.enum(['male', 'female'], {
      message: 'Gênero é obrigatório.',
    }),
    hasInsurance: z.boolean(),
    createUser: z.boolean(),
    insurance: insuranceSchema.optional(),
    address: addressFormSchema,
  })
  .superRefine((data, ctx) => {
    if (data.hasInsurance) {
      const result = insuranceSchema.safeParse(data.insurance);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({
            code: 'custom',
            path: ['insurance', ...(issue.path as string[])],
            message: issue.message,
          });
        });
      }

      // valida senha obrigatória quando for criar usuário
      if (data.createUser && (!data.password || data.password.length < 8)) {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: 'Senha é obrigatória e deve ter pelo menos 8 caracteres',
        });
      }
    }
  });

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

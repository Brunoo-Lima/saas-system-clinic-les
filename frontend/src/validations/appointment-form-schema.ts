import { z } from 'zod';

export const appointmentFormSchema = z.object({
  specialtyId: z.string().min(1, {
    message: 'Especialidade é obrigatória.',
  }),
  insuranceId: z.string().optional().nullable(),
  patientId: z.string().min(1, {
    message: 'Paciente é obrigatório.',
  }),
  doctorId: z.string().min(1, {
    message: 'Médico é obrigatório.',
  }),
  priceOfConsultation: z.number().min(1, {
    message: 'Valor da consulta é obrigatório.',
  }),
  date: z.union([z.date(), z.string()]),
  hour: z.string().min(1, {
    message: 'Horário é obrigatório.',
  }),
  isReturn: z.boolean(),
});

export type AppointmentFormSchema = z.infer<typeof appointmentFormSchema>;

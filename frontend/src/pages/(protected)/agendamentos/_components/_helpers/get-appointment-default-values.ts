import type { IAppointment } from '@/@types/IAppointment';
import type { AppointmentFormSchema } from '@/validations/appointment-form-schema';

export const getAppointmentDefaultValues = (
  appointment?: IAppointment,
): AppointmentFormSchema => ({
  patientId: appointment?.patient.id ?? '',
  doctorId: appointment?.doctor.id ?? '',
  specialtyId: appointment?.specialty.id ?? '',
  insuranceId: appointment?.insurance.id ?? '',
  priceOfConsultation: appointment?.priceOfConsultation ?? 0,
  date: appointment?.date ?? new Date(),
  hour: appointment?.hour ?? '',
  isReturn: appointment?.isReturn ?? false,
});

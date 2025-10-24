import type { IAppointment } from '@/@types/IAppointment';
import type { IAppointmentReturn } from '@/services/appointment-service';

export const normalizeAppointmentData = (
  data: IAppointmentReturn,
): IAppointment => ({
  id: data.id,
  date: data?.date || '', // transforma string ISO em Date
  hour: data.date.includes('T') ? data.date.split('T')[1].slice(0, 5) : '', // extrai hora "HH:mm"
  priceOfConsultation: data.priceOfConsultation,
  isReturn: data.isReturn,
  status: data.status,
  doctor: {
    id: data.doctor.id,
  },
  patient: {
    id: data.patient.id,
  },
  insurance: {
    id: data.insurance.id,
  },
  specialty: {
    id: data.specialties?.id || '',
  },
});

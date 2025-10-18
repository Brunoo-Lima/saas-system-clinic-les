import { AppointmentContext } from '@/contexts/appointment-context';
import { useContext } from 'react';

export const useAppointment = () => {
  const context = useContext(AppointmentContext);

  if (context === undefined) {
    throw new Error('useAppointment must be used within a AppointmentProvider');
  }

  return context;
};

import { DoctorContext } from '@/contexts/doctor-context';
import { useContext } from 'react';

export const useDoctor = () => {
  const context = useContext(DoctorContext);

  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }

  return context;
};

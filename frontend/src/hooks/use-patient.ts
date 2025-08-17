import { PatientContext } from '@/contexts/patient-context';
import { useContext } from 'react';

export const usePatient = () => {
  const context = useContext(PatientContext);

  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }

  return context;
};

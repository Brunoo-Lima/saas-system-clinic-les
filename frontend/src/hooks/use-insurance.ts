import { InsurancesContext } from '@/contexts/insurance-context';
import { useContext } from 'react';

export const useInsurance = () => {
  const context = useContext(InsurancesContext);

  if (context === undefined) {
    throw new Error('useInsurance must be used within a InsurancesProvider');
  }

  return context;
};

import { DashboardContext } from '@/contexts/dashboard-context';
import { useContext } from 'react';

export const useDashboard = () => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }

  return context;
};

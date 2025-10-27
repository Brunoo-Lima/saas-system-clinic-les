import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { InsuranceProvider } from '@/contexts/insurance-context';
import { DoctorProvider } from '@/contexts/doctor-context';
import { PatientProvider } from '@/contexts/patient-context';
import { SpecialtyProvider } from '@/contexts/specialty-context';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppointmentProvider } from '@/contexts/appointment-context';
import { DashboardProvider } from '@/contexts/dashboard-context';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NuqsAdapter>
          <DashboardProvider>
            <InsuranceProvider>
              <SpecialtyProvider>
                <PatientProvider>
                  <DoctorProvider>
                    <AppointmentProvider>{children}</AppointmentProvider>
                  </DoctorProvider>
                </PatientProvider>
              </SpecialtyProvider>
            </InsuranceProvider>
          </DashboardProvider>
        </NuqsAdapter>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

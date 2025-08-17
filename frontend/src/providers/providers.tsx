import { ThemeProvider } from '@/components/ui/theme-provider';
import { DoctorProvider } from '@/contexts/doctor-context';
import { PatientProvider } from '@/contexts/patient-context';
import { NuqsAdapter } from 'nuqs/adapters/react';
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NuqsAdapter>
        <PatientProvider>
          <DoctorProvider>{children}</DoctorProvider>
        </PatientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

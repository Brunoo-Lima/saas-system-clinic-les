import { ThemeProvider } from '@/components/ui/theme-provider';
import { PatientProvider } from '@/contexts/patient-context';
import { NuqsAdapter } from 'nuqs/adapters/react';
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NuqsAdapter>
        <PatientProvider>{children}</PatientProvider>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AgreementsProvider } from "@/contexts/agreements-context";
import { DoctorProvider } from "@/contexts/doctor-context";
import { PatientProvider } from "@/contexts/patient-context";
import { NuqsAdapter } from "nuqs/adapters/react";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NuqsAdapter>
        <AgreementsProvider>
          <PatientProvider>
            <DoctorProvider>{children}</DoctorProvider>
          </PatientProvider>
        </AgreementsProvider>
      </NuqsAdapter>
      <Toaster richColors />
    </ThemeProvider>
  );
};

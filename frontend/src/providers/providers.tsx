import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AgreementsProvider } from "@/contexts/agreements-context";
import { DoctorProvider } from "@/contexts/doctor-context";
import { PatientProvider } from "@/contexts/patient-context";
import { SpecialtyProvider } from "@/contexts/specialty-context";
import { NuqsAdapter } from "nuqs/adapters/react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NuqsAdapter>
        <AgreementsProvider>
          <SpecialtyProvider>
            <PatientProvider>
              <DoctorProvider>{children}</DoctorProvider>
            </PatientProvider>
          </SpecialtyProvider>
        </AgreementsProvider>
      </NuqsAdapter>
      <Toaster richColors />
    </ThemeProvider>
  );
};

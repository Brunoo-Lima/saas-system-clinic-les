import { ThemeProvider } from "@/components/ui/theme-provider";
import { NuqsAdapter } from "nuqs/adapters/react";
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  );
};

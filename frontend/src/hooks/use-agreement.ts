import { AgreementsContext } from "@/contexts/agreements-context";
import { useContext } from "react";

export const useAgreement = () => {
  const context = useContext(AgreementsContext);

  if (context === undefined) {
    throw new Error("useAgreement must be used within a AgreementsProvider");
  }

  return context;
};

import { SpecialtyContext } from "@/contexts/specialty-context";
import { useContext } from "react";

export const useSpecialty = () => {
  const context = useContext(SpecialtyContext);

  if (context === undefined) {
    throw new Error("useSpecialty must be used within a SpecialtyProvider");
  }

  return context;
};

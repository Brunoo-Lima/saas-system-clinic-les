import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { UpsertDoctorForm } from "./upsert-doctor-form";
import { useState } from "react";

export const AddDoctorButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar médico
        </Button>
      </DialogTrigger>

      <UpsertDoctorForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

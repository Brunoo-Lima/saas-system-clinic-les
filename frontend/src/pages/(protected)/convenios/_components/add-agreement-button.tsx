import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { UpsertAgreementForm } from "./upsert-agreement-form";

export const AddAgreementButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar convênio
        </Button>
      </DialogTrigger>
      <UpsertAgreementForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

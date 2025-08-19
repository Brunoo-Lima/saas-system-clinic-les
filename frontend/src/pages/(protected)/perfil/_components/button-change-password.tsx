import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { FormChangePassword } from "./form-change-password";

export const ButtonChangePassword = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Alterar senha</Button>
      </DialogTrigger>

      <FormChangePassword isOpen={isOpen} onSuccess={() => setIsOpen(false)} />
    </Dialog>
  );
};

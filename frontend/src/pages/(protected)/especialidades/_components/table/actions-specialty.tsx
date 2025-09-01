import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditIcon, MoreVerticalIcon } from "lucide-react";
import { useState } from "react";
import type { ISpecialty } from "@/@types/ISpecialty";
import { UpsertSpecialtyForm } from "../upsert-specialty-form";
import { DialogDelete } from "./dialog-delete";

interface IActionsSpecialtyProps {
  specialty: ISpecialty;
}
export const ActionsSpecialty = ({ specialty }: IActionsSpecialtyProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState<boolean>(false);

  // const deletePatientAction = useAction(deletePatient, {
  //   onSuccess: () => {
  //     toast.success("Paciente deletado com sucesso.");
  //   },
  //   onError: () => {
  //     toast.error("Erro ao deletar paciente.");
  //   },
  // });

  return (
    <>
      <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{specialty.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <DialogDelete specialty={specialty} />
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertSpecialtyForm
          isOpen={upsertDialogIsOpen}
          specialty={specialty}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpsertAgreementForm } from "./upsert-agreement-form";
import type { IAgreement } from "@/@types/IAgreement";
import { toast } from "sonner";

interface IActionsAgreementProps {
  agreement: IAgreement;
}
export const ActionsAgreement = ({ agreement }: IActionsAgreementProps) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = useState(false);

  // const deletePatientAction = useAction(deletePatient, {
  //   onSuccess: () => {
  //     toast.success("Paciente deletado com sucesso.");
  //   },
  //   onError: () => {
  //     toast.error("Erro ao deletar paciente.");
  //   },
  // });

  const handleDeleteAgreementClick = () => {
    if (!agreement) return;

    // deletePatientAction.execute({ id: patient.id });
    toast.success("Convênio deletado com sucesso.");
  };

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
            <DropdownMenuLabel>{agreement.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TrashIcon />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja deletar esse convênio?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser revertida. Isso irá deletar o
                    convênio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAgreementClick}>
                    Deletar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>

        <UpsertAgreementForm
          isOpen={upsertDialogIsOpen}
          agreement={agreement}
          onSuccess={() => setUpsertDialogIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

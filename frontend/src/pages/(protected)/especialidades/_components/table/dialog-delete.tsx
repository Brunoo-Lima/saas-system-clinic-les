import type { ISpecialty } from "@/@types/ISpecialty";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

interface IDialogDeleteProps {
  specialty: ISpecialty;
}

export const DialogDelete = ({ specialty }: IDialogDeleteProps) => {
  const handleDeleteSpecialtyClick = () => {
    if (!specialty) return;

    // deletePatientAction.execute({ id: patient.id });
    toast.success("Especialidade deletada com sucesso.");
  };

  return (
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
            Tem certeza que deseja deletar essa especialidade?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser revertida. Isso irá deletar a especialidade.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteSpecialtyClick}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EllipsisIcon, SquarePenIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface IDropdownCardProps {
  onDelete: () => void;
  appointmentId: string;
}

export const DropdownCard = ({
  onDelete,
  appointmentId,
}: IDropdownCardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openDialogEditStatus, setOpenDialogEditStatus] =
    useState<boolean>(false);
  const [status, setStatus] = useState<string | undefined>(undefined);

  const handleUpdateStatusAppointment = (id: string) => {
    console.log(id);
    toast.success('Status atualizado com sucesso.');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="md:ml-auto ml-0">
            <EllipsisIcon size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="left-0">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDialogEditStatus(true);
            }}
          >
            <SquarePenIcon size={20} />
            Atualizar status
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpenDeleteDialog(true);
            }}
          >
            <Trash2Icon size={20} color="#e54" /> Deletar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar esse agendamento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser revertida. Isso irá deletar o agendamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openDialogEditStatus}
        onOpenChange={setOpenDialogEditStatus}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Altere o status do agendamento</AlertDialogTitle>
          </AlertDialogHeader>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="realizado">Realizado</SelectItem>
            </SelectContent>
          </Select>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatusAppointment(appointmentId)}
              disabled={!status}
            >
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

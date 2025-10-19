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
  CalendarDaysIcon,
  EllipsisIcon,
  KeyIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IDropdownCardProps {
  onDeleteDoctor: () => void;
  onSendNewPassword: () => void;
  doctorId: string;
}

export const DropdownCard = ({
  onDeleteDoctor,
  onSendNewPassword,
  doctorId,
}: IDropdownCardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenCalendar = () => {
    navigate(`/agenda/medico/${doctorId}`);
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
          <DropdownMenuItem onClick={handleOpenCalendar}>
            <CalendarDaysIcon size={20} /> Abrir agenda do médico
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={onSendNewPassword}>
            <KeyIcon size={20} /> Enviar nova senha
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
              Tem certeza que deseja deletar esse médico?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser revertida. Isso irá deletar o médico e
              todas as consultas agendadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteDoctor}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

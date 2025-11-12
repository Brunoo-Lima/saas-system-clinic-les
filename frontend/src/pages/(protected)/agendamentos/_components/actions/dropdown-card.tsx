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
import {
  useUpdateAppointmentStatus,
  type IAppointmentReturn,
} from '@/services/appointment-service';
import {
  CalendarDaysIcon,
  EllipsisIcon,
  SquarePenIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IDropdownCardProps {
  onDelete: () => void;
  appointment: IAppointmentReturn;
}

export const DropdownCard = ({ onDelete, appointment }: IDropdownCardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openDialogEditStatus, setOpenDialogEditStatus] =
    useState<boolean>(false);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  console.log('id', appointment.id);

  const handleUpdateStatusAppointment = async (id: string) => {
    updateStatus(
      {
        id,
        status: status || '',
        dateOfRealizable: new Date().toISOString(),
        doctor: { id: appointment.doctor.id },
        specialty: { id: appointment.specialties?.id || '' },
      },
      {
        onSuccess: () => {
          setOpenDialogEditStatus(false);
          setStatus(undefined);
        },
      },
    );
  };

  const handleOpenCalendar = () => {
    navigate(`/agenda/medico/${appointment.doctor.id}`);
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

          <DropdownMenuItem onClick={handleOpenCalendar}>
            <CalendarDaysIcon size={20} /> Abrir agenda do médico
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
              <SelectItem value="PENDING">Agendado</SelectItem>
              <SelectItem value="CANCELED">Cancelado</SelectItem>
              <SelectItem value="CONCLUDE">Realizado</SelectItem>
            </SelectContent>
          </Select>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUpdateStatusAppointment(appointment.id)}
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

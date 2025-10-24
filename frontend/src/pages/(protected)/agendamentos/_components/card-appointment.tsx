import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, DollarSignIcon } from 'lucide-react';
import { useState } from 'react';

import type { IAppointmentReturn } from '@/services/appointment-service';
import { format, parseISO } from 'date-fns';
import { DropdownCard } from './actions/dropdown-card';
import { toast } from 'sonner';
import type { IDoctor } from '@/@types/IDoctor';
import { UpsertAppointmentForm } from './upsert-appointment-form';
import { normalizeAppointmentData } from './_helpers/normalize-appointment';

interface ICardAppointmentProps {
  appointment: IAppointmentReturn;
  doctors: IDoctor[];
}
export const CardAppointment = ({
  appointment,
  doctors,
}: ICardAppointmentProps) => {
  const [isUpsertAppointmentDialogOpen, setIsUpsertAppointmentDialogOpen] =
    useState(false);

  const getDayOfWeekFromDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();

    const daysMap = {
      0: 'Domingo',
      1: 'Segunda-feira',
      2: 'Terça-feira',
      3: 'Quarta-feira',
      4: 'Quinta-feira',
      5: 'Sexta-feira',
      6: 'Sábado',
    };

    return daysMap[dayOfWeek as keyof typeof daysMap] || '';
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'CONFIRMED':
        return 'Confirmado';
      case 'CANCELED':
        return 'Cancelado';
      default:
        return 'N/A';
    }
  };

  const handleDeleteAppointmentClick = () => {
    if (!appointment) return;
    toast.success('Agendamento deletado com sucesso.');
  };

  const dateString = appointment?.date ?? '';
  const hasTimePart = dateString.includes('T');
  const hour = hasTimePart ? dateString.split('T')[1].slice(0, 5) : '';

  const formattedDate = format(parseISO(appointment.date), 'dd/MM/yyyy');

  return (
    <Card className="sm:min-w-[350px] w-[450px]">
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            Agendamento: {appointment.specialties?.name}
          </h2>
          <p className="text-sm font-medium">
            Médico: {appointment.doctor.name}
          </p>
          <p className="text-sm font-medium">
            Paciente: {appointment.patient.name}
          </p>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {getDayOfWeekFromDate(appointment.date)} - Data: {formattedDate} -{' '}
          {hour}
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(appointment.priceOfConsultation)}
        </Badge>

        <Badge variant="outline">Forma de pagamento:</Badge>

        <Badge variant="outline">
          Status: {formatStatus(appointment.status)}
        </Badge>
        {appointment.isReturn && (
          <Badge variant="outline">
            Retorno: {appointment.isReturn ? 'Sim' : 'Não'}
          </Badge>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-2">
        <Dialog
          open={isUpsertAppointmentDialogOpen}
          onOpenChange={setIsUpsertAppointmentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-11/12">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertAppointmentForm
            doctors={doctors}
            appointment={normalizeAppointmentData(appointment)}
            onSuccess={() => setIsUpsertAppointmentDialogOpen(false)}
          />
        </Dialog>
        <DropdownCard
          appointmentId={appointment.id}
          onDelete={handleDeleteAppointmentClick}
          doctorId={appointment.doctor.id}
        />
      </CardFooter>
    </Card>
  );
};

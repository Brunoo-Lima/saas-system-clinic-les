import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { IAppointmentReturn } from '@/services/appointment-service';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, DollarSignIcon } from 'lucide-react';

interface ICardRequestProps {
  appointment: IAppointmentReturn;
  onOpenConfirmModal: (id: string) => void;
  onRecuse: () => void;
  isPending?: boolean;
}

export const CardRequest = ({
  appointment,
  onOpenConfirmModal,
  onRecuse,
  isPending,
}: ICardRequestProps) => {
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
      case 'CONCLUDE':
        return 'Realizado';
      case 'CANCELED':
        return 'Cancelado';
      case 'CANCEL_PENDING':
        return 'Solicitado cancelamento';
      case 'CONFIRMED':
        return 'Confirmado';
      default:
        return 'N/A';
    }
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

        <Badge variant="outline">
          Forma de pagamento: {appointment.insurance?.name || 'Particular'}
        </Badge>

        <Badge variant="outline">
          Status:{' '}
          <span
            className={
              appointment.status === 'CONCLUDE'
                ? 'text-green-600'
                : appointment.status === 'PENDING'
                ? 'text-yellow-600'
                : 'text-red-600'
            }
          >
            {formatStatus(appointment.status)}
          </span>
        </Badge>
        {appointment.isReturn && (
          <Badge variant="outline">
            Retorno: {appointment.isReturn ? 'Sim' : 'Não'}
          </Badge>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={() => onOpenConfirmModal(appointment.id)}
        >
          Aceitar
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={onRecuse}
          disabled={isPending}
        >
          Recusar
        </Button>
      </CardFooter>
    </Card>
  );
};

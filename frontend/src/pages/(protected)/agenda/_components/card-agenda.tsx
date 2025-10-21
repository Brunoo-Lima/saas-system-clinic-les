import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BanIcon, CalendarIcon, SettingsIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DialogBlockDate } from './dialogs/dialog-block-date';
import { useState } from 'react';
import type { IAvailabilitySettings, IBlockedDate } from '@/@types/IAgenda';
import { formatDateToBackend, parseBackendDate } from '../utilities/utilities';
import type { IAppointmentReturn } from '@/services/appointment-service';

interface ICardAgendaProps {
  availabilitySettings: IAvailabilitySettings;
  setAvailabilitySettings: React.Dispatch<
    React.SetStateAction<IAvailabilitySettings>
  >;
  isDayAvailable: (checkDate: Date) => boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  appointments: IAppointmentReturn[] | undefined;
  currentDoctorId: string;
}

export const CardAgenda = ({
  availabilitySettings,
  setAvailabilitySettings,
  isDayAvailable,
  date,
  setDate,
  appointments,
  currentDoctorId,
}: ICardAgendaProps) => {
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] =
    useState(false);
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);
  const [dateToBlock, setDateToBlock] = useState<Date | undefined>(new Date());
  const [blockReason, setBlockReason] = useState<string>('Data bloqueada');

  const toggleWorkingDay = (
    day: keyof IAvailabilitySettings['workingDays'],
  ) => {
    setAvailabilitySettings((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const blockDate = () => {
    if (dateToBlock) {
      const newBlockedDate: IBlockedDate = {
        date: formatDateToBackend(dateToBlock),
        reason: blockReason || 'Data bloqueada',
      };

      setAvailabilitySettings((prev) => ({
        ...prev,
        blockedDates: [...prev.blockedDates, newBlockedDate],
      }));

      setBlockReason('Data bloqueada');
    }
  };

  const unBlockDate = (dateToUnblock: Date) => {
    const dateString = formatDateToBackend(dateToUnblock);

    setAvailabilitySettings((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(
        (blocked) => blocked.date !== dateString,
      ),
    }));
  };

  // Converter blockedDates para Date[] para o Calendar
  const getBlockedDatesAsDateArray = (): Date[] => {
    return availabilitySettings.blockedDates.map((blocked) =>
      parseBackendDate(blocked.date),
    );
  };

  // Verificar se uma data específica está bloqueada
  const isDateBlocked = (checkDate: Date): boolean => {
    const dateString = formatDateToBackend(checkDate);
    return availabilitySettings.blockedDates.some(
      (blocked) => blocked.date === dateString,
    );
  };

  const totalAppointments =
    appointments?.filter((a) => a.doctor.id === currentDoctorId) ?? [];

  const confirmedCount = totalAppointments.filter(
    (a) => a.status === 'CONFIRMED',
  ).length;

  const pendingCount = totalAppointments.filter(
    (a) => a.status === 'PENDING',
  ).length;
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Calendário
        </CardTitle>
        <CardDescription>
          Selecione uma data para ver os agendamentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            blocked: getBlockedDatesAsDateArray(),
            unavailable: (date) => !isDayAvailable(date),
          }}
          modifiersStyles={{
            blocked: {
              textDecoration: 'line-through',
              color: 'hsl(var(--destructive))',
              opacity: 0.5,
            },
            unavailable: {
              opacity: 0.3,
            },
          }}
        />

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total de consultas</span>
            <span className="font-semibold">{totalAppointments.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confirmadas</span>
            <span className="font-semibold text-primary">{confirmedCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pendentes</span>
            <span className="font-semibold text-warning">{pendingCount}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Dialog
            open={isAvailabilityDialogOpen}
            onOpenChange={setIsAvailabilityDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                <SettingsIcon className="h-4 w-4 mr-2" />
                Dias Disponíveis
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Configurar Dias de Atendimento</DialogTitle>
                <DialogDescription>
                  Selecione os dias da semana em que você atende
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {Object.entries(availabilitySettings.workingDays).map(
                  ([day, isEnabled]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <Label
                        htmlFor={day}
                        className="text-base capitalize cursor-pointer"
                      >
                        {day === 'monday' && 'Segunda-feira'}
                        {day === 'tuesday' && 'Terça-feira'}
                        {day === 'wednesday' && 'Quarta-feira'}
                        {day === 'thursday' && 'Quinta-feira'}
                        {day === 'friday' && 'Sexta-feira'}
                        {day === 'saturday' && 'Sábado'}
                        {day === 'sunday' && 'Domingo'}
                      </Label>
                      <Switch
                        id={day}
                        checked={isEnabled}
                        onCheckedChange={() =>
                          toggleWorkingDay(
                            day as keyof IAvailabilitySettings['workingDays'],
                          )
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isBlockDateDialogOpen}
            onOpenChange={setIsBlockDateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                <BanIcon className="h-4 w-4 mr-2" />
                Bloquear Dias
              </Button>
            </DialogTrigger>
            <DialogBlockDate
              availabilitySettings={availabilitySettings}
              dateToBlock={dateToBlock}
              setDateToBlock={setDateToBlock}
              blockDate={blockDate}
              unBlockDate={unBlockDate}
              blockReason={blockReason}
              setBlockReason={setBlockReason}
              isDateBlocked={isDateBlocked}
            />
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

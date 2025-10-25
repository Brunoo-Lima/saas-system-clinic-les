/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useState } from 'react';
import type { IAvailabilitySettings, IBlockedDate } from '@/@types/IAgenda';
import { formatDateToBackend, parseBackendDate } from '../utilities/utilities';
import type { IAppointmentReturn } from '@/services/appointment-service';
import InputDate from '@/components/ui/input-date';
import { eachDayOfInterval, isWithinInterval, format } from 'date-fns';

interface ICardAgendaProps {
  availabilitySettings: IAvailabilitySettings;
  setAvailabilitySettings: React.Dispatch<
    React.SetStateAction<IAvailabilitySettings>
  >;
  isDayAvailable: (checkDate: Date) => boolean;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
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
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: ICardAgendaProps) => {
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] =
    useState(false);
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);
  const [dateToBlock, setDateToBlock] = useState<Date | undefined>(new Date());
  const [blockReason, setBlockReason] = useState<string>('Data bloqueada');
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  // Verificar se uma data específica está bloqueada
  const isDateBlocked = (checkDate: Date): boolean => {
    const dateString = formatDateToBackend(checkDate);
    return availabilitySettings.blockedDates.some(
      (blocked) => blocked.date === dateString,
    );
  };

  // Função para obter todos os dias disponíveis no período
  const getAvailableDates = (from: Date, to: Date): Date[] => {
    if (!from || !to) return [];

    const dateInterval = eachDayOfInterval({
      start: from,
      end: to,
    });

    return dateInterval.filter(
      (date) => isDayAvailable(date) && !isDateBlocked(date),
    );
  };

  // Atualizar datas disponíveis quando dateFrom, dateTo ou configurações mudarem
  useEffect(() => {
    if (dateFrom && dateTo) {
      const available = getAvailableDates(dateFrom, dateTo);
      setAvailableDates(available);
    }
  }, [
    dateFrom,
    dateTo,
    availabilitySettings.workingDays,
    availabilitySettings.blockedDates,
  ]);

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

  // Verificar se uma data está dentro do período selecionado
  const isDateInRange = (checkDate: Date): boolean => {
    if (!dateFrom || !dateTo) return true;
    return isWithinInterval(checkDate, { start: dateFrom, end: dateTo });
  };

  // Verificar se uma data está disponível (dentro do período + dia disponível + não bloqueado)
  const isDateSelectable = (checkDate: Date): boolean => {
    if (!isDateInRange(checkDate)) return false;
    return isDayAvailable(checkDate) && !isDateBlocked(checkDate);
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
            outOfRange: (date) => !isDateInRange(date),
            available: availableDates,
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
            outOfRange: {
              opacity: 0.2,
              cursor: 'not-allowed',
            },
            available: {
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              border: '1px solid hsl(var(--primary) / 0.3)',
            },
          }}
          disabled={(date) => !isDateSelectable(date)}
        />

        <div className="flex items-center gap-4 mt-4">
          {/* Inputs para datas manuais */}
          <div className="flex items-center gap-2">
            <div>
              <Label htmlFor="dateFrom" className="text-sm font-medium">
                Data Inicial
              </Label>
              <InputDate
                value={dateFrom}
                onChange={(date) => setDateFrom(date)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo" className="text-sm font-medium">
                Data Final
              </Label>
              <InputDate value={dateTo} onChange={(date) => setDateTo(date)} />
            </div>
          </div>
        </div>

        {/* Display das datas disponíveis - ADICIONADO NOVAMENTE */}
        {dateFrom && dateTo && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium">Datas Disponíveis</Label>
              <span className="text-xs text-muted-foreground">
                {availableDates.length} dias
              </span>
            </div>
            {availableDates.length > 0 ? (
              <div className="max-h-20 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {availableDates.slice(0, 10).map((availableDate, index) => (
                    <div
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium"
                      title={format(availableDate, 'dd/MM/yyyy')}
                    >
                      {format(availableDate, 'dd/MM')}
                    </div>
                  ))}
                  {availableDates.length > 10 && (
                    <div className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                      +{availableDates.length - 10}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Nenhuma data disponível neste período.
              </p>
            )}
          </div>
        )}

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

          <div className="flex flex-col gap-2">
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

            {/* <Button >Atualizar dia de atendimento</Button> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

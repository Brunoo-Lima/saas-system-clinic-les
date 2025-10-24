import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardAppointment } from './card-appointment';
import { CardAgenda } from './card-agenda';
import type { IAgendaRequest, IAvailabilitySettings } from '@/@types/IAgenda';
import { formatDateToBackend } from '../utilities/utilities';
import {
  useCreateAgenda,
  useGetAgenda,
  useUpdateAgenda,
} from '@/services/agenda-service';
import { toast } from 'sonner';
import { useGetAppointments } from '@/services/appointment-service';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useGetDoctors } from '@/services/doctor-service';

export type StatusConfigProps = {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
};

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CONCLUDE'
  | 'CANCELED';

const statusConfig = {
  PENDING: { label: 'Agendado', variant: 'secondary' },
  CONFIRMED: { label: 'Confirmado', variant: 'default' },
  CONCLUDE: { label: 'Concluído', variant: 'outline' },
  CANCELED: { label: 'Cancelado', variant: 'destructive' },
} satisfies Record<AppointmentStatus, StatusConfigProps>;

const extractWorkingDaysFromPeriods = (periodToWork: any[]) => {
  const workingDays = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };

  periodToWork?.forEach((period) => {
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    if (period.dayWeek >= 0 && period.dayWeek <= 6) {
      workingDays[dayNames[period.dayWeek] as keyof typeof workingDays] = true;
    }
  });

  return workingDays;
};

interface IAgendaProps {
  doctorId: string;
}

export function Agenda({ doctorId }: IAgendaProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    startOfMonth(new Date()),
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    endOfMonth(new Date()),
  );
  const [availabilitySettings, setAvailabilitySettings] =
    useState<IAvailabilitySettings>({
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      blockedDates: [],
    });

  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';

  const { mutate: createAgenda, isPending: isCreatingAgenda } =
    useCreateAgenda();
  const { mutate: updateAgenda, isPending: isUpdatingAgenda } =
    useUpdateAgenda();
  const { data: doctors } = useGetDoctors({ id: doctorId });

  const currentDoctorId = doctorId || '';

  const { data: existingAgendas } = useGetAgenda(currentDoctorId);
  const { data: appointments } = useGetAppointments({
    doctor_id: currentDoctorId,
    scheduling_date: formattedDate,
  });

  const hasNoAgendaData = !existingAgendas || existingAgendas.length === 0;

  useEffect(() => {
    if (existingAgendas && existingAgendas.length > 0) {
      // Se existe agenda, usa os dados da agenda
      const latestAgenda = existingAgendas[0];

      const blockedDates =
        latestAgenda.datesBlocked?.map((blocked: any) => ({
          id: blocked.id,
          date: blocked.dateBlocked,
          reason: blocked.reason,
        })) || [];

      const workingDays = extractWorkingDaysFromPeriods(
        latestAgenda.periodToWork,
      );

      setAvailabilitySettings(() => ({
        workingDays: workingDays,
        blockedDates: blockedDates,
      }));

      // CORREÇÃO: Se já existe agenda, usar as datas da agenda
      if (latestAgenda.dateFrom && latestAgenda.dateTo) {
        setDateFrom(new Date(latestAgenda.dateFrom));
        setDateTo(new Date(latestAgenda.dateTo));
      }
    } else if (doctors && doctors.length > 0) {
      // Se não existe agenda mas existe médico, usa os dados do médico
      const doctor = doctors[0];
      if (doctor.periodToWork) {
        const workingDays = extractWorkingDaysFromPeriods(doctor.periodToWork);

        setAvailabilitySettings((prev) => ({
          ...prev,
          workingDays: workingDays,
        }));
      }
    }
  }, [existingAgendas, doctors]);

  const handleSaveAgenda = (dateFrom: Date, dateTo: Date) => {
    const changes: Partial<IAgendaRequest> = {};

    // Pega a agenda atual para comparar
    const currentAgenda = existingAgendas?.[0];

    // Só envia dateFrom se mudou
    const newDateFrom = formatDateToBackend(dateFrom);
    if (!currentAgenda || currentAgenda.dateFrom !== newDateFrom) {
      changes.dateFrom = newDateFrom;
    }

    // Só envia dateTo se mudou
    const newDateTo = formatDateToBackend(dateTo);
    if (!currentAgenda || currentAgenda.dateTo !== newDateTo) {
      changes.dateTo = newDateTo;
    }

    // Só envia datesBlocked se mudou
    const currentBlockedDates =
      currentAgenda?.datesBlocked?.map((b) => ({
        date: b.dateBlocked,
        reason: b.reason,
      })) || [];

    const newBlockedDates = availabilitySettings.blockedDates.map(
      (blocked) => ({
        date: blocked.date,
        reason: blocked.reason,
      }),
    );

    // Compara se os blockedDates mudaram (comparação simples)
    if (
      JSON.stringify(currentBlockedDates) !== JSON.stringify(newBlockedDates)
    ) {
      changes.datesBlocked = newBlockedDates;
    }

    // Só envia se realmente há mudanças
    if (Object.keys(changes).length === 0) {
      toast.info('Nenhuma alteração detectada');
      return;
    }

    console.log('📤 Mudanças detectadas:', changes);

    if (hasNoAgendaData) {
      createAgenda(
        {
          dateFrom: newDateFrom,
          dateTo: newDateTo,
          doctor: { id: doctorId || '' },
          datesBlocked: newBlockedDates,
        },
        {
          onSuccess: () => {
            toast.success('Agenda criada com sucesso!');
          },
          onError: (error: any) => {
            toast.error(error.message || 'Erro ao criar agenda');
          },
        },
      );
    } else {
      updateAgenda(
        {
          doctorId: currentDoctorId,
          agenda: changes,
        },
        {
          onSuccess: () => {
            toast.success('Agenda atualizada com sucesso!');
          },
          onError: (error: any) => {
            toast.error(error.message || 'Erro ao atualizar agenda');
          },
        },
      );
    }
  };

  const saveAgenda = () => {
    if (!dateFrom || !dateTo) {
      toast.error('Selecione as datas de início e fim');
      return;
    }

    handleSaveAgenda(dateFrom, dateTo);
  };

  const isDateBlocked = (checkDate: Date) => {
    const dateString = formatDateToBackend(checkDate);
    return availabilitySettings.blockedDates.some(
      (blocked) => blocked.date === dateString,
    );
  };

  const isDayAvailable = (checkDate: Date) => {
    const dayNames = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayName = dayNames[
      checkDate.getDay()
    ] as keyof IAvailabilitySettings['workingDays'];
    return availabilitySettings.workingDays[dayName];
  };

  const isSaving = isCreatingAgenda || isUpdatingAgenda;

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex justify-end mb-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={saveAgenda}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving
              ? 'Salvando...'
              : hasNoAgendaData
              ? 'Criar Agenda'
              : 'Atualizar Agenda'}
          </button>
        </div>
      </div>

      {dateFrom && dateTo && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            Período selecionado: {format(dateFrom, 'dd/MM/yyyy')} até{' '}
            {format(dateTo, 'dd/MM/yyyy')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardAgenda
          date={date}
          setDate={setDate}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          availabilitySettings={availabilitySettings}
          setAvailabilitySettings={setAvailabilitySettings}
          isDayAvailable={isDayAvailable}
          appointments={appointments}
          currentDoctorId={currentDoctorId}
        />

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Agendamentos do Dia</CardTitle>
                <CardDescription>
                  {date?.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {date && (isDateBlocked(date) || !isDayAvailable(date)) && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">
                  {isDateBlocked(date)
                    ? '⚠️ Esta data está bloqueada para atendimento'
                    : '⚠️ Você não atende neste dia da semana'}
                </p>
              </div>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="PENDING">Agendados</TabsTrigger>
                <TabsTrigger value="CONFIRMED">Confirmados</TabsTrigger>
                <TabsTrigger value="CONCLUDE">Concluídos</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {appointments?.map((appointment) => (
                  <CardAppointment
                    key={appointment.id}
                    appointment={appointment}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="PENDING" className="space-y-3">
                {appointments &&
                  appointments
                    .filter((a) => a.status === 'PENDING')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))}
              </TabsContent>

              <TabsContent value="CONFIRMED" className="space-y-3">
                {appointments &&
                  appointments
                    .filter((a) => a.status === 'CONFIRMED')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))}
              </TabsContent>

              <TabsContent value="CONCLUDE" className="space-y-3">
                {appointments &&
                  appointments
                    .filter((a) => a.status === 'CONCLUDE')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

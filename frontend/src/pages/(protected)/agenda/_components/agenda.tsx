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
import type { IDoctor } from '@/@types/IDoctor';

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
  doctorId: string | undefined;
  doctor: IDoctor;
}

export function Agenda({ doctorId, doctor }: IAgendaProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    startOfMonth(new Date()),
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    endOfMonth(new Date()),
  );
  const currentSpecialtyId = doctor?.specialties?.[0]?.id || '';

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

  const currentDoctorId = doctorId || '';

  const { data: existingAgendas } = useGetAgenda(currentDoctorId);
  const { data: appointments } = useGetAppointments({
    doctor_id: currentDoctorId,
    scheduling_date: formattedDate,
  });

  const hasNoAgendaData = !existingAgendas || existingAgendas.length === 0;

  useEffect(() => {
    if (existingAgendas && existingAgendas.length > 0) {
      const latestAgenda = existingAgendas[0];

      const blockedDates =
        latestAgenda.datesBlocked?.map((blocked: any) => ({
          id: blocked.id, // ✅ Mantém o id
          date: blocked.dateBlocked,
          reason: blocked.reason,
        })) || [];

      const workingDays = extractWorkingDaysFromPeriods(
        latestAgenda.periodToWork,
      );

      setAvailabilitySettings(() => ({
        workingDays: workingDays,
        blockedDates: blockedDates, // ✅ Agora com ids
      }));

      if (latestAgenda.dateFrom && latestAgenda.dateTo) {
        setDateFrom(new Date(latestAgenda.dateFrom));
        setDateTo(new Date(latestAgenda.dateTo));
      }
    } else if (doctor) {
      if (doctor.periodToWork) {
        const workingDays = extractWorkingDaysFromPeriods(doctor.periodToWork);
        setAvailabilitySettings((prev) => ({
          ...prev,
          workingDays: workingDays,
        }));
      }
    }
  }, [existingAgendas, doctor]);

  const handleSaveAgenda = (dateFrom: Date, dateTo: Date) => {
    const changes: Partial<IAgendaRequest> = {};
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

    const currentBlockedDates =
      currentAgenda?.datesBlocked?.map((b) => ({
        id: b.id, //  Mantém o id para blocos existentes
        date: b.dateBlocked,
        reason: b.reason,
      })) || [];

    const newBlockedDates = availabilitySettings.blockedDates.map((blocked) => {
      // Para blocos existentes, mantém o id. Para novos, pode ser undefined
      const existingBlock = currentBlockedDates.find(
        (current) => current.date === blocked.date,
      );

      return {
        id: existingBlock?.id, // id será undefined para novos blocos
        date: blocked.date,
        reason: blocked.reason,
      };
    });

    // Comparação considerando apenas date e reason
    const hasBlockedDatesChanged =
      currentBlockedDates.length !== newBlockedDates.length ||
      !currentBlockedDates.every((currentBlock) =>
        newBlockedDates.some(
          (newBlock) =>
            newBlock.date === currentBlock.date &&
            newBlock.reason === currentBlock.reason,
        ),
      ) ||
      !newBlockedDates.every((newBlock) =>
        currentBlockedDates.some(
          (currentBlock) =>
            currentBlock.date === newBlock.date &&
            currentBlock.reason === newBlock.reason,
        ),
      );

    if (hasBlockedDatesChanged) {
      changes.datesBlocked = newBlockedDates;
    }

    // Só envia se realmente há mudanças
    if (Object.keys(changes).length === 0) {
      toast.info('Nenhuma alteração detectada');
      return;
    }

    if (hasNoAgendaData) {
      const createData = {
        dateFrom: newDateFrom,
        dateTo: newDateTo,
        doctor: { id: doctorId || '' },
        datesBlocked: newBlockedDates.map(({ date, reason }) => ({
          id: '',
          date,
          reason,
        })),
      };

      createAgenda(createData);
    } else {
      updateAgenda({
        agendaId: currentAgenda?.id || '',
        agenda: changes,
      });
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

  // Calcular estatísticas para os avisos
  const totalAvailableDays =
    dateFrom && dateTo
      ? Object.values(availabilitySettings.workingDays).filter(Boolean).length *
        4 // Aproximadamente 4 semanas
      : 0;

  const hasBlockedDates = availabilitySettings.blockedDates.length > 0;
  const hasNoWorkingDays = Object.values(
    availabilitySettings.workingDays,
  ).every((day) => !day);

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Avisos no topo */}
      <div className="space-y-3 mb-6">
        {hasNoAgendaData && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-amber-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">
                  Agenda não configurada
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>
                    Você ainda não possui uma agenda configurada. Configure os
                    períodos de atendimento e datas disponíveis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasNoWorkingDays && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Nenhum dia de atendimento configurado
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Você precisa selecionar pelo menos um dia da semana para
                    atendimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasBlockedDates && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Datas bloqueadas
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Você tem {availabilitySettings.blockedDates.length} data(s)
                    bloqueada(s) para atendimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {totalAvailableDays > 0 && !hasNoWorkingDays && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Agenda configurada
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Sua agenda está configurada com{' '}
                    {
                      Object.values(availabilitySettings.workingDays).filter(
                        Boolean,
                      ).length
                    }{' '}
                    dia(s) de atendimento por semana.
                    {totalAvailableDays > 0 &&
                      ` Aproximadamente ${totalAvailableDays} dias disponíveis no período.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
          currentSpecialtyId={currentSpecialtyId}
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

            {appointments && appointments.length === 0 && (
              <div className="mb-4 p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground text-center">
                  📝 Nenhum agendamento para esta data
                </p>
              </div>
            )}

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full sm:grid-cols-4 grid-cols-1 mb-6 sm:pb-6 pb-0 sm:h-9 h-full">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="PENDING">Agendados</TabsTrigger>
                <TabsTrigger value="CONFIRMED">Confirmados</TabsTrigger>
                <TabsTrigger value="CONCLUDE">Concluídos</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {appointments && appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <CardAppointment
                      key={appointment.id}
                      appointment={appointment}
                      statusConfig={statusConfig}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento encontrado
                  </div>
                )}
              </TabsContent>

              <TabsContent value="PENDING" className="space-y-3">
                {appointments &&
                appointments.filter((a) => a.status === 'PENDING').length >
                  0 ? (
                  appointments
                    .filter((a) => a.status === 'PENDING')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento pendente
                  </div>
                )}
              </TabsContent>

              <TabsContent value="CONFIRMED" className="space-y-3">
                {appointments &&
                appointments.filter((a) => a.status === 'CONFIRMED').length >
                  0 ? (
                  appointments
                    .filter((a) => a.status === 'CONFIRMED')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento confirmado
                  </div>
                )}
              </TabsContent>

              <TabsContent value="CONCLUDE" className="space-y-3">
                {appointments &&
                appointments.filter((a) => a.status === 'CONCLUDE').length >
                  0 ? (
                  appointments
                    .filter((a) => a.status === 'CONCLUDE')
                    .map((appointment) => (
                      <CardAppointment
                        key={appointment.id}
                        appointment={appointment}
                        statusConfig={statusConfig}
                      />
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum agendamento concluído
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { useCreateAgenda, useGetAgenda } from '@/services/agenda-service';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { useGetAppointments } from '@/services/appointment-service';
import { format } from 'date-fns';

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

export function Agenda() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [date, setDate] = useState<Date | undefined>(new Date());
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

  const currentDoctorId = doctorId || '';

  const { data: existingAgenda } = useGetAgenda(currentDoctorId);
  const { data: appointments } = useGetAppointments({
    doctor_id: currentDoctorId,
    scheduling_date: formattedDate,
  });

  console.log('agenda', existingAgenda);
  console.log('agendamentos', appointments);

  useEffect(() => {
    if (existingAgenda) {
      // Atualiza o availabilitySettings com os dados do backend
      setAvailabilitySettings((prev) => ({
        ...prev,
        blockedDates: existingAgenda.datesBlocked || [],
      }));
    }
  }, [existingAgenda]);

  const handleSaveAgenda = (dateFrom: Date, dateTo: Date) => {
    const agendaData: IAgendaRequest = {
      dateFrom: formatDateToBackend(dateFrom),
      dateTo: formatDateToBackend(dateTo),
      doctor: {
        id: doctorId || '',
      },
    };

    // Adiciona datesBlocked apenas se houver datas bloqueadas
    if (availabilitySettings.blockedDates.length > 0) {
      agendaData.datesBlocked = availabilitySettings.blockedDates;
    }

    createAgenda(agendaData, {
      onSuccess: () => {
        toast.success('Agenda salva com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Erro ao salvar agenda');
      },
    });
  };

  const saveCurrentMonthAgenda = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    handleSaveAgenda(firstDay, lastDay);
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

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={saveCurrentMonthAgenda}
          disabled={isCreatingAgenda}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreatingAgenda ? 'Salvando...' : 'Salvar Agenda'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CardAgenda
          date={date}
          setDate={setDate}
          availabilitySettings={availabilitySettings}
          setAvailabilitySettings={setAvailabilitySettings}
          isDayAvailable={isDayAvailable}
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

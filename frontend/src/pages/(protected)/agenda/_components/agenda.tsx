import { useState } from 'react';
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
import { agendaList } from '@/mocks/agenda-list';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface AppointmentAgenda {
  id: string;
  time: string;
  patient: {
    name: string;
    avatar?: string;
    phone: string;
    email: string;
  };
  duration: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface AvailabilitySettings {
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  blockedDates: Date[];
}

export type StatusConfigProps = {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
};

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
  }
> = {
  scheduled: { label: 'Agendado', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  completed: { label: 'Concluído', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

export function Agenda() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, _setSelectedAppointment] =
    useState<AppointmentAgenda | null>(null);
  const [availabilitySettings, setAvailabilitySettings] =
    useState<AvailabilitySettings>({
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

  const isDateBlocked = (checkDate: Date) => {
    return availabilitySettings.blockedDates.some(
      (d) => d.toDateString() === checkDate.toDateString(),
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
    ] as keyof AvailabilitySettings['workingDays'];
    return availabilitySettings.workingDays[dayName];
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
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
                <TabsTrigger value="scheduled">Agendados</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {agendaList.map((appointment) => (
                  <CardAppointment
                    key={appointment.id}
                    appointment={appointment}
                    isSelected={selectedAppointment?.id === appointment.id}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-3">
                {agendaList
                  .filter((a) => a.status === 'scheduled')
                  .map((appointment) => (
                    <CardAppointment
                      key={appointment.id}
                      appointment={appointment}
                      isSelected={selectedAppointment?.id === appointment.id}
                      statusConfig={statusConfig}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-3">
                {agendaList
                  .filter((a) => a.status === 'confirmed')
                  .map((appointment) => (
                    <CardAppointment
                      key={appointment.id}
                      appointment={appointment}
                      isSelected={selectedAppointment?.id === appointment.id}
                      statusConfig={statusConfig}
                    />
                  ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3">
                {agendaList
                  .filter((a) => a.status === 'completed')
                  .map((appointment) => (
                    <CardAppointment
                      key={appointment.id}
                      appointment={appointment}
                      isSelected={selectedAppointment?.id === appointment.id}
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

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Settings, Ban } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ModalDetails } from './modal-details';
import { CardAppointment } from './card-appointment';
import { DialogBlockDate } from './dialogs/dialog-block-date';

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
  type: string;
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

const mockAppointments: AppointmentAgenda[] = [
  {
    id: '1',
    time: '09:00',
    patient: {
      name: 'Maria Silva',
      phone: '(11) 98765-4321',
      email: 'maria.silva@email.com',
    },
    type: 'Consulta de Rotina',
    duration: 30,
    status: 'confirmed',
  },
  {
    id: '2',
    time: '09:30',
    patient: {
      name: 'João Santos',
      phone: '(11) 91234-5678',
      email: 'joao.santos@email.com',
    },
    type: 'Retorno',
    duration: 30,
    status: 'scheduled',
  },
  {
    id: '3',
    time: '10:30',
    patient: {
      name: 'Ana Costa',
      phone: '(11) 99876-5432',
      email: 'ana.costa@email.com',
    },
    type: 'Primeira Consulta',
    duration: 60,
    status: 'confirmed',
  },
  {
    id: '4',
    time: '14:00',
    patient: {
      name: 'Pedro Oliveira',
      phone: '(11) 97654-3210',
      email: 'pedro.oliveira@email.com',
    },
    type: 'Consulta de Rotina',
    duration: 30,
    status: 'scheduled',
  },
  {
    id: '5',
    time: '15:00',
    patient: {
      name: 'Carla Mendes',
      phone: '(11) 96543-2109',
      email: 'carla.mendes@email.com',
    },
    type: 'Exames',
    duration: 45,
    status: 'completed',
  },
];

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
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] =
    useState(false);
  const [isBlockDateDialogOpen, setIsBlockDateDialogOpen] = useState(false);
  const [dateToBlock, setDateToBlock] = useState<Date | undefined>(new Date());

  const toggleWorkingDay = (day: keyof AvailabilitySettings['workingDays']) => {
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
      setAvailabilitySettings((prev) => ({
        ...prev,
        blockedDates: [...prev.blockedDates, dateToBlock],
      }));
      setIsBlockDateDialogOpen(false);
    }
  };

  const unBlockDate = (dateToUnblock: Date) => {
    setAvailabilitySettings((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(
        (d) => d.toDateString() !== dateToUnblock.toDateString(),
      ),
    }));
  };

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
                blocked: availabilitySettings.blockedDates,
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
                <span className="text-muted-foreground">
                  Total de consultas
                </span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confirmadas</span>
                <span className="font-semibold text-primary">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pendentes</span>
                <span className="font-semibold text-warning">2</span>
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
                    <Settings className="h-4 w-4 mr-2" />
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
                                day as keyof AvailabilitySettings['workingDays'],
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
                    <Ban className="h-4 w-4 mr-2" />
                    Bloquear Dias
                  </Button>
                </DialogTrigger>
                <DialogBlockDate
                  availabilitySettings={availabilitySettings}
                  dateToBlock={dateToBlock}
                  setDateToBlock={setDateToBlock}
                  blockDate={blockDate}
                  unBlockDate={unBlockDate}
                  setIsBlockDateDialogOpen={setIsBlockDateDialogOpen}
                />
              </Dialog>

              <Button className="w-full" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Nova Consulta
              </Button>
            </div>
          </CardContent>
        </Card>

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
                {mockAppointments.map((appointment) => (
                  <CardAppointment
                    key={appointment.id}
                    appointment={appointment}
                    isSelected={selectedAppointment?.id === appointment.id}
                    statusConfig={statusConfig}
                  />
                ))}
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-3">
                {mockAppointments
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
                {mockAppointments
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
                {mockAppointments
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

      {selectedAppointment && (
        <ModalDetails
          selectedAppointment={selectedAppointment}
          statusConfig={statusConfig}
        />
      )}
    </div>
  );
}

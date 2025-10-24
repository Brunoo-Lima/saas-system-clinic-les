import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IAppointmentReturn } from '@/services/appointment-service';
import { CalendarIcon, Clock, User } from 'lucide-react';

interface IAppointmentNextProps {
  appointments?: IAppointmentReturn[];
}

export const AppointmentNext = ({
  appointments = [],
}: IAppointmentNextProps) => {
  // Filtrar agendamentos de hoje
  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  // Ordenar por horário
  const sortedAppointments = todayAppointments.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-muted-foreground" />
            <CardTitle className="text-base">Agendamentos de hoje</CardTitle>
          </div>
          <span className="text-sm text-muted-foreground">
            {sortedAppointments.length} agendamentos
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum agendamento para hoje
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {formatTime(appointment.date)}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {appointment.patient.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {appointment.doctor.name} •{' '}
                      {appointment.specialties?.name}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === 'CONFIRMED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {appointment.status === 'PENDING'
                    ? 'Pendente'
                    : appointment.status === 'CONFIRMED'
                    ? 'Confirmado'
                    : 'Outro'}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

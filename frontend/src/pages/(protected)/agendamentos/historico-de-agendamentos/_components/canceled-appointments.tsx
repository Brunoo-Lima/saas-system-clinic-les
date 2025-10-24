import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatus, getStatusUi } from '../_constants/get-message';
import { Separator } from '@/components/ui/separator';
import type { IAppointmentReturn } from '@/services/appointment-service';
import { format } from 'date-fns';

interface IAllAppointmentsProps {
  appointments?: IAppointmentReturn[];
}

const CanceledAppointments = ({ appointments }: IAllAppointmentsProps) => {
  const filtered = appointments?.filter((p) => p.status === 'CANCELLED');

  return (
    <div className="flex flex-col gap-y-4">
      {filtered?.map((ap) => (
        <Card key={ap.id}>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>
              Paciente:{' '}
              <strong className="font-semibold">{ap.patient.name}</strong>
            </CardTitle>
            <Badge className={`py-1 px-2 ${getStatus(ap.status)}`}>
              {getStatusUi[ap.status]}
            </Badge>
          </CardHeader>

          <Separator />

          <CardContent>
            <p>
              Médico(a): <strong>{ap.doctor.name}</strong>
            </p>
            <p>
              Especialidade: <strong>{ap.specialties?.name}</strong>
            </p>
            <p>
              Data e hora: {format(new Date(ap.date), 'dd/MM/yyyy')} às{' '}
              {ap.date.includes('T') ? ap.date.split('T')[1].slice(0, 5) : ''}
            </p>
          </CardContent>
        </Card>
      ))}

      {filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <p className="text-muted-foreground">Nenhum agendamento cancelado.</p>
        </div>
      )}
    </div>
  );
};

export default CanceledAppointments;

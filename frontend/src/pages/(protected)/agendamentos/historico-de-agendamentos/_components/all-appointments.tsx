import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getStatus, getStatusUi } from '../_constants/get-message';
import { Separator } from '@/components/ui/separator';
import type { IAppointmentReturn } from '@/services/appointment-service';
import { format } from 'date-fns';

interface IAllAppointmentsProps {
  appointments?: IAppointmentReturn[];
}

const AllAppointments = ({ appointments }: IAllAppointmentsProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      {appointments?.map((ap) => (
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

      {appointments?.length === 0 && (
        <Card>
          <CardContent>
            <p className="text-center">Nenhum agendamento encontrado.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AllAppointments;

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allAppointmentsList } from '@/mocks/historic-appointments/all-appointments';
import { getStatus, getStatusUi } from '../_constants/get-message';
import { Separator } from '@/components/ui/separator';

const FinishedAppointments = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {allAppointmentsList
        .filter((p) => p.status === 'finished')
        .map((ap) => (
          <Card key={ap.id}>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>
                Paciente:{' '}
                <strong className="font-semibold">{ap.pacient_name}</strong>
              </CardTitle>
              <Badge className={`py-1 px-2 ${getStatus(ap.status)}`}>
                {getStatusUi[ap.status]}
              </Badge>
            </CardHeader>

            <Separator />

            <CardContent>
              <p>
                Médico(a): <strong>{ap.doctor}</strong>
              </p>
              <p>
                Especialidade: <strong>{ap.specialty}</strong>
              </p>
              <p>
                Data e hora: {ap.date} às {ap.hour}
              </p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default FinishedAppointments;

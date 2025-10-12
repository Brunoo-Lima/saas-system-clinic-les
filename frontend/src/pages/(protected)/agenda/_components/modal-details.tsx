import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import type { AppointmentAgenda, AppointmentStatus } from './agenda';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export type StatusConfigProps = {
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
};

interface IModalDetailsProps {
  selectedAppointment: AppointmentAgenda;
  statusConfig: Record<AppointmentStatus, StatusConfigProps>;
}

export const ModalDetails = ({
  selectedAppointment,
  statusConfig,
}: IModalDetailsProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Detalhes da Consulta {selectedAppointment.patient.name}
        </DialogTitle>
      </DialogHeader>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detalhes da Consulta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      selectedAppointment.patient.avatar || '/placeholder.svg'
                    }
                  />
                  <AvatarFallback className="text-lg">
                    {selectedAppointment.patient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedAppointment.patient.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.type}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MailIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.patient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedAppointment.time} - {selectedAppointment.duration}{' '}
                    minutos
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <div className="mt-2">
                  <Badge
                    variant={statusConfig[selectedAppointment.status].variant}
                  >
                    {statusConfig[selectedAppointment.status].label}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Reagendar
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button className="flex-1">Confirmar</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DialogContent>
  );
};

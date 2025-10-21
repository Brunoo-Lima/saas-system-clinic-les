import { cn } from '@/lib/utils';
import type { AppointmentStatus, StatusConfigProps } from './agenda';
import { Badge } from '@/components/ui/badge';
import { ClockIcon, MailIcon, PhoneIcon } from 'lucide-react';
import type { IAppointmentReturn } from '@/services/appointment-service';

interface ICardAppointmentProps {
  appointment: IAppointmentReturn;
  statusConfig: Record<AppointmentStatus, StatusConfigProps>;
}

export const CardAppointment = ({
  appointment,
  statusConfig,
}: ICardAppointmentProps) => {
  return (
    <div
      className={cn(
        'w-full text-left p-4 rounded-lg border transition-all hover:shadow-md border-border bg-card',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-xs font-medium text-primary">
              {appointment.date.split('-')[2].split('T')[0]}
            </span>
            <span className="text-lg font-bold text-primary">
              {appointment.date.split('-')[1]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">
                {appointment.patient.name}
              </h4>
              <Badge
                variant={
                  statusConfig[appointment.status as AppointmentStatus].variant
                }
                className="text-xs"
              >
                {statusConfig[appointment.status as AppointmentStatus].label}
              </Badge>
            </div>

            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {appointment.patient.phone}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MailIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {appointment.patient.email}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {appointment.timeOfConsultation}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

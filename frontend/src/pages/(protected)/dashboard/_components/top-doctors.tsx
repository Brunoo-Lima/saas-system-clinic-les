import { Stethoscope } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import type { IAppointmentReturn } from '@/services/appointment-service';

interface TopDoctorsProps {
  doctors?: {
    id: string;
    name: string;
    specialties: {
      id: string;
      name: string;
    }[];
  }[];
  appointments?: IAppointmentReturn[];
}

export const TopDoctors = ({
  doctors = [],
  appointments = [],
}: TopDoctorsProps) => {
  const getInitials = (name: string) => {
    if (!name.trim()) return '??';
    return name
      .split(' ')
      .map((n) => n[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2);
  };

  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-muted-foreground" />
            <CardTitle className="text-base">Médicos</CardTitle>
          </div>
        </div>

        <div className="space-y-6">
          {doctors.map((doctor) => {
            const appointmentCount =
              appointments.filter((a) => a.doctor.id === doctor.id).length || 0;

            return (
              <div
                key={doctor.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-lg font-medium text-gray-600">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm">{doctor.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {doctor.specialties.map((s) => s.name).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm font-medium">
                    {appointmentCount} agend.
                  </span>
                </div>
              </div>
            );
          })}

          {!doctors.length && (
            <div className="flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Nenhum médico encontrado.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

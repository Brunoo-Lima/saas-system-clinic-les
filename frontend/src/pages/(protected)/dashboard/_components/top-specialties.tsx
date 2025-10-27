import { Stethoscope } from 'lucide-react';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { IAppointmentReturn } from '@/services/appointment-service';

interface ITopSpecialtiesProps {
  appointments?: IAppointmentReturn[];
}

export const TopSpecialties = ({ appointments }: ITopSpecialtiesProps) => {
  const specialtiesCount =
    appointments?.reduce((acc, appointment) => {
      const specialtyName =
        appointment.specialties?.name || 'Sem especialidade';

      if (!acc[specialtyName]) {
        acc[specialtyName] = 0;
      }
      acc[specialtyName]++;
      return acc;
    }, {} as Record<string, number>) || {};

  // Converter para array e ordenar por quantidade (maior primeiro)
  const topSpecialties = Object.entries(specialtiesCount)
    .map(([specialty, count]) => ({
      specialty,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const maxAppointments =
    topSpecialties.length > 0
      ? Math.max(...topSpecialties.map((i) => i.count))
      : 0;

  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Stethoscope className="text-muted-foreground" />
            <CardTitle className="text-base">Especialidades</CardTitle>
          </div>
        </div>

        <div className="space-y-6">
          {topSpecialties.map((specialty) => {
            const progressValue =
              maxAppointments > 0
                ? (specialty.count / maxAppointments) * 100
                : 0;

            return (
              <div
                key={specialty.specialty}
                className="flex items-center gap-2"
              >
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <Stethoscope className="text-primary h-5 w-5" />
                </div>
                <div className="flex w-full flex-col justify-center">
                  <div className="flex w-full justify-between">
                    <h3 className="text-sm">{specialty.specialty}</h3>
                    <div className="text-right">
                      <span className="text-muted-foreground text-sm font-medium">
                        {specialty.count} agend.
                      </span>
                    </div>
                  </div>
                  <Progress value={progressValue} className="w-full" />
                </div>
              </div>
            );
          })}

          {topSpecialties.length === 0 && (
            <div className="flex w-full justify-center">
              <span className="text-muted-foreground text-sm font-medium">
                Nenhuma especialidade encontrada.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

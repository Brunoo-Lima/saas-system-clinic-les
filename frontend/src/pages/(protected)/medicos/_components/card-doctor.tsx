import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react';
import { useState } from 'react';

import { UpsertDoctorForm } from './upsert-doctor-form';
import { toast } from 'sonner';
import { DropdownCard } from './actions/dropdown-card';
import { formattedDayWeek } from '@/utils/format-day-week';
import type { IDoctor } from '@/@types/IDoctor';

interface ICardDoctorProps {
  doctor: IDoctor;
}
export const CardDoctor = ({ doctor }: ICardDoctorProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  const doctorInitials = doctor.name
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('');

  const handleDeleteDoctorClick = () => {
    if (!doctor) return;
    toast.success('Médico deletado com sucesso.');
  };

  const handleSendNewPassword = () => {
    toast.success('Nova senha enviada para email!');
  };

  return (
    <Card className="sm:min-w-[350px] w-[450px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{doctor.name}</h3>
            <p className="text-muted-foreground text-sm">
              {doctor.specialties.map((s) => s.name).join(', ')}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2 flex-1">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {doctor?.periodToWork
            ?.map((p) => formattedDayWeek(p.dayWeek))
            .join(', ') || 'N/A'}
        </Badge>
        <Badge variant="outline" className="flex flex-col items-start gap-1">
          {doctor?.periodToWork?.map((a) => (
            <span key={a.dayWeek} className="flex items-center gap-x-2">
              <ClockIcon size={16} className="mr-1" />
              {`${a.timeFrom.slice(0, 5)} - ${a.timeTo.slice(
                0,
                5,
              )} (${formattedDayWeek(a.dayWeek)})`}
            </span>
          ))}
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {doctor.specialties
            .map((s) => `${(s.percentDistribution * 100).toFixed(0)}%`)
            .join(', ')}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-11/12">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={{
              ...(doctor as any),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
            isOpen={isUpsertDoctorDialogOpen}
          />
        </Dialog>

        <DropdownCard
          onDeleteDoctor={handleDeleteDoctorClick}
          onSendNewPassword={handleSendNewPassword}
          doctorId={doctor.id}
        />
      </CardFooter>
    </Card>
  );
};

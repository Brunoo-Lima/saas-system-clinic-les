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
import { usePasswordUser } from '@/services/user-service';

interface ICardDoctorProps {
  doctor: IDoctor;
}
export const CardDoctor = ({ doctor }: ICardDoctorProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);
  const { mutate } = usePasswordUser();

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
    if (!doctor.user.id) return;
    mutate(doctor.user.id);
  };

  return (
    <Card className="sm:min-w-[350px] w-[450px] overflow-hidden h-[350px]">
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
      <CardContent className="flex flex-col gap-2 flex-1 px-2 sm:px-4">
        <Badge variant="outline" className="">
          <CalendarIcon className="mr-1 shrink-0" />
          <p className="overflow-hidden text-ellipsis whitespace-nowrap w-[250px]">
            {doctor?.periodToWork
              ?.map((p) => formattedDayWeek(p.dayWeek))
              .join(', ') || 'N/A'}
          </p>
        </Badge>
        <Badge variant="outline" className="flex flex-col items-start gap-1 ">
          {doctor?.periodToWork?.slice(0, 4).map((a) => (
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
      <CardFooter className="flex items-center gap-2 px-4">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="sm:w-10/12 w-max">Ver detalhes</Button>
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

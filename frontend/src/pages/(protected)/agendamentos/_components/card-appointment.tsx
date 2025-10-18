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
import { CalendarIcon, DollarSignIcon } from 'lucide-react';
import { useState } from 'react';

import type { IAppointment } from '@/@types/IAppointment';
import { AddAppointmentForm } from './add-appointment-form';

interface ICardAppointmentProps {
  appointment: IAppointment;
}
export const CardAppointment = ({ appointment }: ICardAppointmentProps) => {
  const [isUpsertAppointmentDialogOpen, setIsUpsertAppointmentDialogOpen] =
    useState(false);

  console.log('appointment', appointment);

  // const handleDeleteAppointmentClick = () => {
  //   if (!appointment) return;
  //   toast.success('Agendamento deletado com sucesso.');
  // };

  return (
    <Card className="sm:min-w-[350px] w-[450px]">
      <CardHeader>
        <div className="flex items-center gap-2">
          {/* <Avatar className="h-10 w-10">
            <AvatarFallback>{appointment.name}</AvatarFallback>
          </Avatar> */}
          <div>
            <h3 className="text-sm font-medium">{appointment.doctor.id}</h3>
            <p className="text-muted-foreground text-sm">
              {/* {appointment.specialties.map((s) => s.id)} */}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          {/* {appointment.periods.map((p) => formattedDayWeek(p.dayWeek)).join(', ')} */}
        </Badge>
        <Badge variant="outline" className="flex flex-col items-start gap-1">
          {/* {appointment.periods.map((a) => (
            <span key={a.dayWeek} className="flex items-center gap-x-2">
              <ClockIcon size={16} className="mr-1" />
              {`${a.timeFrom.slice(0, 5)} - ${a.timeTo.slice(
                0,
                5,
              )} (${formattedDayWeek(a.dayWeek)})`}
            </span>
          ))} */}
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {appointment.priceOfConsultation}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex items-center gap-2">
        <Dialog
          open={isUpsertAppointmentDialogOpen}
          onOpenChange={setIsUpsertAppointmentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-11/12">Ver detalhes</Button>
          </DialogTrigger>
          <AddAppointmentForm
            doctors={[]}
            patients={[]}
            isOpen={isUpsertAppointmentDialogOpen}
            onSuccess={() => {}}
          />
        </Dialog>
        {/* 
        <DropdownCard
          onDeleteappointment={handleDeleteappointmentClick}
          onSendNewPassword={handleSendNewPassword}
        /> */}
      </CardFooter>
    </Card>
  );
};

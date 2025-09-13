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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TrashIcon } from 'lucide-react';
import { formatCurrencyInCents } from '@/utils/format-currency-in-cents';
import type { IDoctor } from '@/@types/IDoctor';
import { UpsertDoctorForm } from './upsert-doctor-form';
import { toast } from 'sonner';
// import { getAvailability } from "../_helpers/availability";
interface ICardDoctorProps {
  doctor: IDoctor; //retorna as props do banco
}
export const CardDoctor = ({ doctor }: ICardDoctorProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  const doctorInitials = doctor.name
    .split(' ')
    .map((name) => name[0])
    .slice(1, 3)
    .join('');

  // const availability = getAvailability(doctor);

  // console.log(availability);

  const handleDeleteDoctorClick = () => {
    if (!doctor) return;

    toast.success('Médico deletado com sucesso.');
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
              {doctor.specialties.map((s) => s.specialty).join(', ')}
            </p>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-2">
        <Badge variant="outline">
          <CalendarIcon className="mr-1" />
          Segunda a Sexta
          {/* {availability.map((a) => a.to.format("dddd")).join(", ")} */}
        </Badge>
        <Badge variant="outline">
          <ClockIcon className="mr-1" />
          09:00 as 18:00
          {/* {availability.map(
            (a) => `${a.to.format("HH:mm")} as ${a.from.format("HH:mm")}`
          )} */}
        </Badge>

        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.servicePriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col gap-2">
        <Dialog
          open={isUpsertDoctorDialogOpen}
          onOpenChange={setIsUpsertDoctorDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
          <UpsertDoctorForm
            doctor={{
              ...doctor,
              // availableToTime: availability.to.format("HH:mm:ss"), //14:00:00
              // availableFromTime: availability.from.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
            isOpen={isUpsertDoctorDialogOpen}
          />
        </Dialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TrashIcon />
              Deletar médico
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja deletar esse médico?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser revertida. Isso irá deletar o médico e
                todas as consultas agendadas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteDoctorClick}>
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

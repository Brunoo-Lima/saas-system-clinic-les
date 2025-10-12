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

import type { IDoctor } from '@/@types/IDoctor';
import { UpsertDoctorForm } from './upsert-doctor-form';
import { toast } from 'sonner';
import { DropdownCard } from './actions/dropdown-card';

interface ICardDoctorProps {
  doctor: IDoctor;
}
export const CardDoctor = ({ doctor }: ICardDoctorProps) => {
  const [isUpsertDoctorDialogOpen, setIsUpsertDoctorDialogOpen] =
    useState(false);

  const doctorInitials = doctor.name
    .split(' ')
    .map((name) => name[0])
    .slice(1, 3)
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
              {/* {doctor.specialties.map((s) => s.specialty).join(', ')} */}
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
          {/* {formatCurrencyInCents(doctor.servicePriceInCents)} */}
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
              ...doctor,
              // availableToTime: availability.to.format("HH:mm:ss"), //14:00:00
              // availableFromTime: availability.from.format("HH:mm:ss"),
            }}
            onSuccess={() => setIsUpsertDoctorDialogOpen(false)}
            isOpen={isUpsertDoctorDialogOpen}
          />
        </Dialog>

        <DropdownCard
          onDeleteDoctor={handleDeleteDoctorClick}
          onSendNewPassword={handleSendNewPassword}
        />
        {/* <div className="grid grid-cols-2 gap-2 w-full">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
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

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSendNewPassword}
          >
            Enviar nova senha
          </Button>

        </div> */}
      </CardFooter>
    </Card>
  );
};

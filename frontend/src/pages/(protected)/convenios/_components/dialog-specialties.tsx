import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ISpecialtyProps {
  id: number;
  name: string;
  price: number;
  amountTransferred: number;
}

interface IDialogSpecialtiesProps {
  specialties: ISpecialtyProps[];
}

export const DialogSpecialties = ({ specialties }: IDialogSpecialtiesProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>Especialidades</Button>
      </DialogTrigger>

      <DialogContent className="h-max">
        <DialogHeader>
          <DialogTitle>Especialidades atendidas</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {specialties.map((specialty) => (
            <p key={specialty.id}>{specialty.name}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

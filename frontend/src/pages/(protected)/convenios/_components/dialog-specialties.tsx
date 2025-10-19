import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ISpecialtyProps {
  id: string;
  name?: string;
  price: number;
  amountTransferred: number;
}

interface IDialogSpecialtiesProps {
  specialties: ISpecialtyProps[] | [];
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
          {specialties?.map((specialty) => (
            <div
              key={specialty.id}
              className="flex justify-between gap-2 items-center"
            >
              <p>{specialty.name}</p>
              <div className="flex items-center gap-2">
                <p>
                  Preço:{' '}
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(specialty.price)}
                </p>
                <p>
                  Repasse:{' '}
                  {Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(specialty.amountTransferred)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

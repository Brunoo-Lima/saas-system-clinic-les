import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import type { IDoctor } from '@/@types/IDoctor';
import { AddAppointmentForm } from '../add-appointment-form';

interface IAddAppointmentButtonProps {
  doctors: IDoctor[];
}

export const AddAppointmentButton = ({
  doctors,
}: IAddAppointmentButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Novo agendamento
        </Button>
      </DialogTrigger>

      <AddAppointmentForm
        isOpen={isOpen}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

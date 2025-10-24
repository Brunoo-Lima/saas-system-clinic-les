import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import type { IDoctor } from '@/@types/IDoctor';
import { UpsertAppointmentForm } from '../upsert-appointment-form';

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

      <UpsertAppointmentForm
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
};

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateInsuranceForm } from '../forms/create-insurance-form';

export const AddInsuranceButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar convênio
        </Button>
      </DialogTrigger>

      <CreateInsuranceForm onSuccess={() => setIsOpen(false)} isOpen={isOpen} />
    </Dialog>
  );
};

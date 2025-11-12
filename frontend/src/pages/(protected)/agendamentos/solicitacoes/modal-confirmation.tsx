import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface IModalConfirmationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
  handleConfirm: () => void;
}
export const ModalConfirmation = ({
  open,
  setOpen,
  isPending,
  handleConfirm,
}: IModalConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar cancelamento</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja cancelar este agendamento? Essa ação não
            poderá ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Voltar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Cancelando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BanIcon, CheckCircle2Icon } from 'lucide-react';
import type { AvailabilitySettings } from '../agenda';

interface IDialogBlockDateProps {
  availabilitySettings: AvailabilitySettings;
  dateToBlock: Date | undefined;
  setDateToBlock: (date: Date | undefined) => void;
  blockDate: () => void;
  unBlockDate: (dateToUnblock: Date) => void;
  setIsBlockDateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogBlockDate = ({
  availabilitySettings,
  dateToBlock,
  setDateToBlock,
  blockDate,
  unBlockDate,
  setIsBlockDateDialogOpen,
}: IDialogBlockDateProps) => {
  const handleBlockDate = () => {
    blockDate();
    setIsBlockDateDialogOpen(true);
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Bloquear Dias Específicos</DialogTitle>
        <DialogDescription>
          Selecione datas para bloquear (feriados, férias, etc.)
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Calendar
          mode="single"
          selected={dateToBlock}
          onSelect={setDateToBlock}
          disabled={availabilitySettings.blockedDates}
          className="rounded-md border"
        />
        <Button onClick={handleBlockDate} className="w-full">
          <BanIcon className="h-4 w-4 mr-2" />
          Bloquear Data Selecionada
        </Button>

        {availabilitySettings.blockedDates.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Datas Bloqueadas:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availabilitySettings.blockedDates.map((blockedDate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-md bg-muted"
                >
                  <span className="text-sm">
                    {blockedDate.toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => unBlockDate(blockedDate)}
                  >
                    <CheckCircle2Icon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};
